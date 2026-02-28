"use client";

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaCode, FaSave, FaCheckCircle, FaExclamationTriangle, FaGoogle, FaFacebook } from 'react-icons/fa';
import api from '@/api/axios';

interface SiteSettingsData {
    googleTrackingCode: string;
    metaTrackingCode: string;
}

interface StatusMessage {
    type: 'success' | 'error' | '';
    text: string;
}

const SiteSettings: React.FC = () => {
    const [settings, setSettings] = useState<SiteSettingsData>({
        googleTrackingCode: '',
        metaTrackingCode: ''
    });

    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [message, setMessage] = useState<StatusMessage>({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await api.get('/admin/site-settings');
            if (response.data.success) {
                setSettings(response.data.data);
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to load site settings'
            });
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async (): Promise<void> => {
        try {
            setSaving(true);
            setMessage({ type: '', text: '' });

            const response = await api.put('/admin/site-settings', settings);

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Site settings updated successfully!' });
                fetchSettings();
            }
        } catch (error: any) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to save settings'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center p-8 min-h-100">
                    <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-linear-to-br from-blue-500 to-cyan-600 rounded-xl text-white">
                        <FaCode className="text-2xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Site Settings</h2>
                        <p className="text-gray-500">Manage tracking codes and analytics</p>
                    </div>
                </div>

                {/* Status Message */}
                {message.text && (
                    <div className={`p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                        {message.text}
                    </div>
                )}

                {/* Settings Form */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-8 shadow-sm">
                    {/* Google Analytics Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-800">
                            <FaGoogle className="text-red-500" />
                            <h3 className="text-lg font-semibold">Google Tracking Code</h3>
                        </div>
                        <p className="text-sm text-gray-500">
                            Paste your Google Analytics Global Site Tag (gtag.js) here. This code will be placed in the <code>&lt;head&gt;</code> of your website.
                        </p>
                        <textarea
                            value={settings.googleTrackingCode}
                            onChange={(e) => setSettings({ ...settings, googleTrackingCode: e.target.value })}
                            placeholder="<!-- Google tag (gtag.js) -->..."
                            className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm leading-relaxed"
                        />
                    </div>

                    <div className="border-t border-gray-100 pt-8" />

                    {/* Meta Pixel Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-800">
                            <FaFacebook className="text-blue-600" />
                            <h3 className="text-lg font-semibold">Meta Pixel Tracking Code</h3>
                        </div>
                        <p className="text-sm text-gray-500">
                            Paste your Meta Pixel (formerly Facebook Pixel) base code here. This code will be placed in the <code>&lt;head&gt;</code> and <code>&lt;body&gt;</code> (noscript) parts of your website.
                        </p>
                        <textarea
                            value={settings.metaTrackingCode}
                            onChange={(e) => setSettings({ ...settings, metaTrackingCode: e.target.value })}
                            placeholder="<!-- Meta Pixel Code -->..."
                            className="w-full h-48 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm leading-relaxed"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            onClick={saveSettings}
                            disabled={saving}
                            className="w-full py-4 bg-linear-to-r from-brand-blue to-indigo-600 hover:from-brand-blue-dark hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-md hover:shadow-lg active:scale-[0.98]"
                        >
                            {saving ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <FaSave /> Save Site Settings
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default SiteSettings;
