"use client";

import React, { useState, useMemo } from 'react';
import {
    FiPlus, FiEdit2, FiTrash2, FiSearch, FiX, FiSave, FiGrid, FiCornerDownRight,
} from 'react-icons/fi';
import {
    useGetAdminCategoriesQuery,
    useDeleteCategoryMutation,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
} from '@/redux/api/categoryApi';
import { toast } from 'react-hot-toast';

/* ─── Styles ─── */
const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid #e5e7eb', borderRadius: '7px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lbl: React.CSSProperties = { fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' };

const emptyForm = {
    name: '',
    slug: '',            // optional — auto-generated on the server when empty
    parent: '',          // '' = top-level (root) category
    icon: '',
    order: 0,
    description: '',
    isActive: true,
    showInMenu: true,
    showInHome: true,
};

const CategoriesPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { data: categoriesData, isLoading } = useGetAdminCategoriesQuery(undefined);
    const [deleteCategory] = useDeleteCategoryMutation();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

    /* ─── Modal State ─── */
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ ...emptyForm });

    const categories: any[] = categoriesData?.data || [];
    const isSaving = isCreating || isUpdating;

    /* Helper: id of a category's parent regardless of populated/raw */
    const parentId = (c: any) => (c?.parent?._id || c?.parent || '');

    /* Only root categories can be a parent (keeps menu to 2 levels) */
    const rootCategories = useMemo(
        () => categories.filter(c => !parentId(c)),
        [categories]
    );

    /* ─── Build hierarchical, search-filtered list ─── */
    const tree = useMemo(() => {
        const q = searchTerm.trim().toLowerCase();
        const match = (c: any) => !q || (c.name || '').toLowerCase().includes(q);

        return rootCategories
            .map(root => {
                const children = categories
                    .filter(c => parentId(c) === root._id)
                    .sort((a, b) => (a.order || 0) - (b.order || 0) || a.name.localeCompare(b.name));
                const visibleChildren = children.filter(match);
                const show = match(root) || visibleChildren.length > 0;
                // when searching, only show children that match; otherwise show all
                return { root, children: q ? visibleChildren : children, show };
            })
            .filter(r => r.show)
            .sort((a, b) => (a.root.order || 0) - (b.root.order || 0) || a.root.name.localeCompare(b.root.name));
    }, [categories, rootCategories, searchTerm]);

    const openCreate = (presetParent = '') => {
        setEditingId(null);
        setForm({ ...emptyForm, parent: presetParent });
        setModalOpen(true);
    };

    const openEdit = (cat: any) => {
        setEditingId(cat._id);
        setForm({
            name: cat.name || '',
            slug: cat.slug || '',
            parent: parentId(cat),
            icon: cat.icon || '',
            order: cat.order || 0,
            description: cat.description || '',
            isActive: cat.isActive !== false,
            showInMenu: cat.showInMenu !== false,
            showInHome: cat.showInHome !== false,
        });
        setModalOpen(true);
    };

    const closeModal = () => { setModalOpen(false); setEditingId(null); };

    const handleSave = async () => {
        if (!form.name.trim()) { toast.error('Category name is required'); return; }
        // A category cannot be its own parent
        if (editingId && form.parent === editingId) { toast.error('A category cannot be its own parent'); return; }

        const payload = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            parent: form.parent || null,
            icon: form.icon.trim(),
            order: Number(form.order) || 0,
            description: form.description,
            isActive: form.isActive,
            showInMenu: form.showInMenu,
            showInHome: form.showInHome,
        };

        try {
            if (editingId) {
                await updateCategory({ id: editingId, data: payload }).unwrap();
                toast.success('Category updated');
            } else {
                await createCategory(payload).unwrap();
                toast.success(form.parent ? 'Sub-category created' : 'Category created');
            }
            closeModal();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Something went wrong');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id).unwrap();
                toast.success('Category deleted');
            } catch (error: any) {
                toast.error(error?.data?.message || 'Failed to delete');
            }
        }
    };

    /* ─── Row renderer (shared by roots & children) ─── */
    const renderRow = (cat: any, isChild = false) => (
        <div key={cat._id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: isChild ? '10px 16px 10px 44px' : '12px 16px',
            borderBottom: '1px solid #f5f5f5',
            background: isChild ? '#fcfcfc' : '#fff',
            transition: 'background 0.15s',
        }}
            onMouseEnter={e => e.currentTarget.style.background = isChild ? '#f7f7f7' : '#fafafa'}
            onMouseLeave={e => e.currentTarget.style.background = isChild ? '#fcfcfc' : '#fff'}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                {isChild && <FiCornerDownRight size={14} color="#ccc" style={{ flexShrink: 0 }} />}
                <div style={{
                    width: isChild ? '30px' : '36px', height: isChild ? '30px' : '36px', borderRadius: '8px',
                    background: '#f5f5f5', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexShrink: 0, fontSize: '16px',
                }}>
                    {cat.icon ? <span>{cat.icon}</span> : <FiGrid size={isChild ? 14 : 16} color="#bbb" />}
                </div>
                <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#111', margin: 0 }}>{cat.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10.5px', color: '#aaa', fontFamily: 'monospace' }}>{cat.slug}</span>
                        <span style={{
                            fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '999px',
                            background: cat.isActive ? 'var(--color-primary-lightest)' : '#fef2f2',
                            color: cat.isActive ? '#16a34a' : '#dc2626',
                        }}>
                            {cat.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {cat.showInMenu && (
                            <span style={{
                                fontSize: '9px', fontWeight: 700, padding: '1px 6px', borderRadius: '999px',
                                background: '#fff7ed', color: '#c2410c',
                            }}>
                                In Menu
                            </span>
                        )}
                        <span style={{ fontSize: '10px', color: '#ccc' }}>{cat.productCount || 0} products</span>
                    </div>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                {!isChild && (
                    <button onClick={() => openCreate(cat._id)} title="Add sub-category" style={{
                        width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'transparent', border: '1px solid transparent', borderRadius: '6px',
                        cursor: 'pointer', color: '#16a34a', transition: 'all 0.15s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                    >
                        <FiPlus size={15} />
                    </button>
                )}
                <button onClick={() => openEdit(cat)} title="Edit" style={{
                    width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'transparent', border: '1px solid transparent', borderRadius: '6px',
                    cursor: 'pointer', color: 'var(--color-primary)', transition: 'all 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-primary-lightest)'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                    <FiEdit2 size={14} />
                </button>
                <button onClick={() => handleDelete(cat._id)} title="Delete" style={{
                    width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'transparent', border: '1px solid transparent', borderRadius: '6px',
                    cursor: 'pointer', color: '#dc2626', transition: 'all 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.borderColor = '#e5e7eb'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent'; }}
                >
                    <FiTrash2 size={14} />
                </button>
            </div>
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                    <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#111', margin: 0 }}>Categories</h1>
                    <p style={{ fontSize: '12px', color: '#888', margin: '2px 0 0' }}>Manage categories, sub-categories &amp; the header menu</p>
                </div>
                <button onClick={() => openCreate()} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', background: 'var(--color-primary)', color: '#fff',
                    border: 'none', borderRadius: '7px', fontSize: '12.5px', fontWeight: 700,
                    cursor: 'pointer',
                }}>
                    <FiPlus size={14} /> Add Category
                </button>
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
                <FiSearch size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#bbb' }} />
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ ...inp, paddingLeft: '34px' }}
                />
            </div>

            {/* Categories List */}
            <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '10px', overflow: 'hidden' }}>
                {isLoading ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <div style={{ width: '28px', height: '28px', border: '3px solid #e5e7eb', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
                    </div>
                ) : tree.length > 0 ? (
                    <div>
                        {tree.map(({ root, children }) => (
                            <div key={root._id}>
                                {renderRow(root)}
                                {children.map((child: any) => renderRow(child, true))}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <FiGrid size={28} color="#ddd" style={{ margin: '0 auto 10px' }} />
                        <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 12px' }}>No categories found</p>
                        <button onClick={() => openCreate()} style={{
                            padding: '7px 16px', background: 'var(--color-primary)', color: '#fff',
                            border: 'none', borderRadius: '7px', fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                        }}>
                            <FiPlus size={12} style={{ marginRight: '4px', verticalAlign: '-2px' }} /> Create Category
                        </button>
                    </div>
                )}
            </div>

            {/* ═══ POPUP MODAL ═══ */}
            {modalOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    {/* Backdrop */}
                    <div onClick={closeModal} style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)',
                    }} />

                    {/* Modal */}
                    <div style={{
                        position: 'relative', background: '#fff',
                        borderRadius: '12px', width: '440px', maxWidth: '90vw',
                        maxHeight: '90vh', overflowY: 'auto',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        animation: 'fadeIn 0.2s ease-out',
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '16px 20px', borderBottom: '1px solid #f0f0f0',
                            position: 'sticky', top: 0, background: '#fff', zIndex: 1,
                        }}>
                            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#111', margin: 0 }}>
                                {editingId ? 'Edit Category' : (form.parent ? 'Add Sub-category' : 'Add Category')}
                            </h3>
                            <button onClick={closeModal} style={{
                                width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: '#f5f5f5', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#888',
                            }}>
                                <FiX size={14} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {/* Name */}
                            <div>
                                <label style={lbl}>Category Name <span style={{ color: 'var(--color-secondary)' }}>*</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. জামদানি, অলংকার"
                                    value={form.name}
                                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                                    style={inp}
                                    autoFocus
                                />
                            </div>

                            {/* Slug */}
                            <div>
                                <label style={lbl}>Slug / URL <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                                <input
                                    type="text"
                                    placeholder="e.g. jamdani  (auto-generated if left blank)"
                                    value={form.slug}
                                    onChange={e => setForm(p => ({ ...p, slug: e.target.value }))}
                                    style={inp}
                                />
                                <p style={{ fontSize: '11px', color: '#999', margin: '5px 0 0' }}>
                                    Used in the URL: <code>/category/{form.slug.trim() || 'your-slug'}</code>. Use English letters for Bengali names.
                                </p>
                            </div>

                            {/* Parent */}
                            <div>
                                <label style={lbl}>Parent Category</label>
                                <select
                                    value={form.parent}
                                    onChange={e => setForm(p => ({ ...p, parent: e.target.value }))}
                                    style={{ ...inp, cursor: 'pointer', background: '#fff' }}
                                >
                                    <option value="">— None (Top-level / Menu category) —</option>
                                    {rootCategories
                                        .filter(c => c._id !== editingId)
                                        .map(c => (
                                            <option key={c._id} value={c._id}>{c.name}</option>
                                        ))}
                                </select>
                                <p style={{ fontSize: '11px', color: '#999', margin: '5px 0 0' }}>
                                    {form.parent
                                        ? 'This will be a sub-category — it appears inside its parent\'s dropdown in the header.'
                                        : 'Top-level category — can be shown directly in the header menu.'}
                                </p>
                            </div>

                            {/* Icon + Order */}
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={lbl}>Icon (emoji) <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                                    <input
                                        type="text"
                                        placeholder="🥻"
                                        value={form.icon}
                                        onChange={e => setForm(p => ({ ...p, icon: e.target.value }))}
                                        style={inp}
                                        maxLength={4}
                                    />
                                </div>
                                <div style={{ width: '110px' }}>
                                    <label style={lbl}>Menu Order</label>
                                    <input
                                        type="number"
                                        value={form.order}
                                        onChange={e => setForm(p => ({ ...p, order: Number(e.target.value) }))}
                                        style={inp}
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label style={lbl}>Description <span style={{ color: '#aaa', fontWeight: 400 }}>(optional)</span></label>
                                <textarea
                                    placeholder="Short description..."
                                    rows={2}
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    style={{ ...inp, resize: 'vertical' }}
                                />
                            </div>

                            {/* Toggles */}
                            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[
                                    { key: 'isActive', label: 'Active' },
                                    { key: 'showInMenu', label: 'Show in Header Menu' },
                                    { key: 'showInHome', label: 'Show on Homepage' },
                                ].map((toggle) => (
                                    <label key={toggle.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                                        <span style={{ fontSize: '12.5px', color: '#555', fontWeight: 500 }}>{toggle.label}</span>
                                        <div
                                            onClick={() => setForm(p => ({ ...p, [toggle.key]: !(p as any)[toggle.key] }))}
                                            style={{
                                                position: 'relative', width: '36px', height: '20px',
                                                borderRadius: '999px', cursor: 'pointer',
                                                background: (form as any)[toggle.key] ? 'var(--color-primary)' : '#ddd',
                                                transition: 'background 0.2s',
                                            }}
                                        >
                                            <div style={{
                                                position: 'absolute', top: '3px',
                                                left: (form as any)[toggle.key] ? '19px' : '3px',
                                                width: '14px', height: '14px', borderRadius: '50%',
                                                background: '#fff', transition: 'left 0.2s',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                            }} />
                                        </div>
                                    </label>
                                ))}
                                <p style={{ fontSize: '11px', color: '#999', margin: '2px 0 0' }}>
                                    “Show in Header Menu” controls whether this {form.parent ? 'sub-category appears in its parent\'s dropdown' : 'category appears in the site header'}.
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            display: 'flex', gap: '8px', padding: '14px 20px',
                            borderTop: '1px solid #f0f0f0',
                            position: 'sticky', bottom: 0, background: '#fff',
                        }}>
                            <button onClick={closeModal} style={{
                                flex: 1, padding: '9px', background: '#f5f5f5', color: '#666',
                                border: 'none', borderRadius: '7px', fontSize: '12.5px', fontWeight: 600,
                                cursor: 'pointer',
                            }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} disabled={isSaving} style={{
                                flex: 1, padding: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                background: isSaving ? '#888' : 'var(--color-primary)', color: '#fff',
                                border: 'none', borderRadius: '7px', fontSize: '12.5px', fontWeight: 700,
                                cursor: isSaving ? 'not-allowed' : 'pointer',
                            }}>
                                <FiSave size={13} />
                                {isSaving ? 'Saving...' : editingId ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesPage;
