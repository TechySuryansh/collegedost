"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaCog, FaKey, FaRobot, FaToggleOn, FaToggleOff, FaSave, FaPlay, FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import api from '@/api/axios';

/**
 * Interface for predictor settings
 */
interface PredictorSettingsData {
    isEnabled: boolean;
    useAI: boolean;
    aiModel: string;
    hasApiKey: boolean;
    apiKeyPreview: string;
    maxRequestsPerUser: number;
    cacheResultsMinutes: number;
}

/**
 * Interface for status message
 */
interface StatusMessage {
    type: 'success' | 'error' | '';
    text: string;
}

/**
 * Interface for test connection result
 */
interface TestConnectionResult {
    success: boolean;
    message: string;
    model?: string;
}

/**
 * Interface for prediction test input
 */
interface TestPredictionInput {
    percentile: number;
    category: string;
    homeState: string;
    gender: string;
}

/**
 * Interface for prediction summary
 */
interface PredictionSummary {
    good_chances: number;
    may_get: number;
    tough_chances: number;
}

/**
 * Interface for predictor status
 */
interface PredictorStatus {
    model: string;
}

/**
 * Interface for prediction result
 */
interface PredictionResult {
    success: boolean;
    message?: string;
    estimated_rank?: number;
    summary?: PredictionSummary;
    predictor_status?: PredictorStatus;
}

/**
 * Admin Predictor Settings component.
 * Configure AI-powered JEE college predictions.
 */
const PredictorSettings: React.FC = () => {
    const [settings, setSettings] = useState<PredictorSettingsData>({
        isEnabled: false,
        useAI: true,
        aiModel: 'gpt-4o',
        hasApiKey: false,
        apiKeyPreview: 'Not configured',
        maxRequestsPerUser: 10,
        cacheResultsMinutes: 60
    });

    const [newApiKey, setNewApiKey] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [saving, setSaving] = useState<boolean>(false);
    const [testing, setTesting] = useState<boolean>(false);
    const [testResult, setTestResult] = useState<TestConnectionResult | null>(null);
    const [message, setMessage] = useState<StatusMessage>({ type: '', text: '' });

    // Test prediction input
    const [testInput, setTestInput] = useState<TestPredictionInput>({
        percentile: 95,
        category: 'OBC-NCL',
        homeState: 'Rajasthan',
        gender: 'Male'
    });
    const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async (): Promise<void> => {
        try {
            setLoading(true);
            const response = await api.get('/admin/predictor-settings');
            if (response.data.success) {
                setSettings(response.data.data);
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async (): Promise<void> => {
        try {
            setSaving(true);
            setMessage({ type: '', text: '' });

            const updateData: Record<string, unknown> = {
                isEnabled: settings.isEnabled,
                useAI: settings.useAI,
                aiModel: settings.aiModel,
                maxRequestsPerUser: settings.maxRequestsPerUser,
                cacheResultsMinutes: settings.cacheResultsMinutes
            };

            if (newApiKey) {
                updateData.openaiApiKey = newApiKey;
            }

            const response = await api.put('/admin/predictor-settings', updateData);
            
            if (response.data.success) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' });
                setNewApiKey('');
                fetchSettings();
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save settings' });
        } finally {
            setSaving(false);
        }
    };

    const testConnection = async (): Promise<void> => {
        try {
            setTesting(true);
            setTestResult(null);
            const response = await api.post('/admin/predictor-settings/test');
            setTestResult(response.data);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setTestResult({ success: false, message: err.response?.data?.message || 'Connection test failed' });
        } finally {
            setTesting(false);
        }
    };

    const testPrediction = async (): Promise<void> => {
        try {
            setTesting(true);
            setPredictionResult(null);
            const response = await api.post('/admin/predictor-settings/test-predict', testInput);
            setPredictionResult(response.data);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setPredictionResult({ success: false, message: err.response?.data?.message || 'Prediction test failed' });
        } finally {
            setTesting(false);
        }
    };

    const deleteApiKey = async (): Promise<void> => {
        if (!window.confirm('Are you sure you want to remove the API key?')) return;

        try {
            await api.delete('/admin/predictor-settings/api-key');
            setMessage({ type: 'success', text: 'API key removed successfully' });
            fetchSettings();
        } catch (error: unknown) {
            setMessage({ type: 'error', text: 'Failed to remove API key' });
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center p-8 min-h-[400px]">
                    <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin"></div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
                    <FaRobot className="text-2xl" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">College Predictor Settings</h2>
                    <p className="text-gray-500">Configure AI-powered JEE college predictions</p>
                </div>
            </div>

            {/* Status Message */}
            {message.text && (
                <div className={`p-4 rounded-xl flex items-center gap-3 ${
                    message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                    {message.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                    {message.text}
                </div>
            )}

            {/* Main Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                {/* Enable/Disable Predictor */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <h3 className="font-semibold text-gray-900">Enable Predictor</h3>
                        <p className="text-sm text-gray-500">Allow users to access the college predictor</p>
                    </div>
                    <button
                        onClick={() => setSettings({ ...settings, isEnabled: !settings.isEnabled })}
                        className={`text-3xl transition-colors ${settings.isEnabled ? 'text-green-500' : 'text-gray-400'}`}
                    >
                        {settings.isEnabled ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                </div>

                {/* Use AI Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                        <h3 className="font-semibold text-gray-900">Use OpenAI</h3>
                        <p className="text-sm text-gray-500">Use GPT for predictions (requires API key)</p>
                    </div>
                    <button
                        onClick={() => setSettings({ ...settings, useAI: !settings.useAI })}
                        className={`text-3xl transition-colors ${settings.useAI ? 'text-blue-500' : 'text-gray-400'}`}
                    >
                        {settings.useAI ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                </div>

                {/* AI Model Selection */}
                <div className="p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">AI Model</h3>
                    <select
                        value={settings.aiModel}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSettings({ ...settings, aiModel: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                    >
                        <option value="gpt-4o">GPT-4o (Recommended)</option>
                        <option value="gpt-4o-mini">GPT-4o Mini (Faster)</option>
                        <option value="gpt-4-turbo">GPT-4 Turbo</option>
                        <option value="gpt-3.5-turbo">GPT-3.5 Turbo (Budget)</option>
                    </select>
                </div>

                {/* OpenAI API Key */}
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                        <FaKey className="text-amber-500" />
                        <h3 className="font-semibold text-gray-900">OpenAI API Key</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 text-sm">
                        <span className="text-gray-500">Current:</span>
                        <code className={`px-2 py-1 rounded ${settings.hasApiKey ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {settings.apiKeyPreview}
                        </code>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="password"
                            value={newApiKey}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewApiKey(e.target.value)}
                            placeholder="sk-..."
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-blue focus:border-transparent font-mono text-sm"
                        />
                        {settings.hasApiKey && (
                            <button
                                onClick={deleteApiKey}
                                className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
                            >
                                <FaTrash />
                            </button>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Get your API key from <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">OpenAI Dashboard</a>
                    </p>
                </div>

                {/* Rate Limiting */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-3">Max Requests/User/Day</h3>
                        <input
                            type="number"
                            value={settings.maxRequestsPerUser}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, maxRequestsPerUser: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                            min={1}
                            max={100}
                        />
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                        <h3 className="font-semibold text-gray-900 mb-3">Cache Duration (mins)</h3>
                        <input
                            type="number"
                            value={settings.cacheResultsMinutes}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSettings({ ...settings, cacheResultsMinutes: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl"
                            min={1}
                            max={1440}
                        />
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="w-full py-4 bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-brand-blue-dark hover:to-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <>
                            <FaSave /> Save Settings
                        </>
                    )}
                </button>
            </div>

            {/* Test Connection */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaCog className="text-gray-400" /> Test Connection
                </h3>
                
                <button
                    onClick={testConnection}
                    disabled={testing || !settings.hasApiKey}
                    className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                    {testing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <FaPlay />
                    )}
                    Test OpenAI Connection
                </button>

                {testResult && (
                    <div className={`mt-4 p-4 rounded-xl ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {testResult.success ? <FaCheckCircle className="inline mr-2" /> : <FaExclamationTriangle className="inline mr-2" />}
                        {testResult.message}
                        {testResult.model && <span className="ml-2 font-mono text-sm">({testResult.model})</span>}
                    </div>
                )}
            </div>

            {/* Test Prediction */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FaRobot className="text-purple-500" /> Test Prediction
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Percentile</label>
                        <input
                            type="number"
                            value={testInput.percentile}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTestInput({ ...testInput, percentile: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                        <select
                            value={testInput.category}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTestInput({ ...testInput, category: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="General">General</option>
                            <option value="OBC-NCL">OBC-NCL</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="EWS">EWS</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Home State</label>
                        <input
                            type="text"
                            value={testInput.homeState}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setTestInput({ ...testInput, homeState: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Gender</label>
                        <select
                            value={testInput.gender}
                            onChange={(e: ChangeEvent<HTMLSelectElement>) => setTestInput({ ...testInput, gender: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={testPrediction}
                    disabled={testing || !settings.isEnabled}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center gap-2 disabled:opacity-50"
                >
                    {testing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <FaPlay />
                    )}
                    Run Test Prediction
                </button>

                {predictionResult && (
                    <div className="mt-4">
                        {predictionResult.success ? (
                            <div className="bg-gray-50 rounded-xl p-4 overflow-auto max-h-96">
                                <div className="mb-3 flex items-center gap-2">
                                    <span className="text-green-600 font-semibold">✓ Prediction Successful</span>
                                    {predictionResult.predictor_status && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            {predictionResult.predictor_status.model}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm">
                                    <p><strong>Estimated Rank:</strong> {predictionResult.estimated_rank?.toLocaleString()}</p>
                                    <p><strong>Good Chances:</strong> {predictionResult.summary?.good_chances}</p>
                                    <p><strong>May Get:</strong> {predictionResult.summary?.may_get}</p>
                                    <p><strong>Tough Chances:</strong> {predictionResult.summary?.tough_chances}</p>
                                </div>
                                <details className="mt-3">
                                    <summary className="cursor-pointer text-blue-600 text-sm">View Full JSON Response</summary>
                                    <pre className="mt-2 text-xs bg-slate-900 text-green-400 p-4 rounded-lg overflow-auto">
                                        {JSON.stringify(predictionResult, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        ) : (
                            <div className="bg-red-50 text-red-700 p-4 rounded-xl">
                                <FaExclamationTriangle className="inline mr-2" />
                                {predictionResult.message}
                            </div>
                        )}
                    </div>
                )}
            </div>
            </div>
        </AdminLayout>
    );
};

export default PredictorSettings;
