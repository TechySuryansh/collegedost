"use client";

import React from 'react';
import { PredictorBase } from '@/components/predictor';
import { mhtcetConfig } from '@/components/predictor/configs';

const PageContent: React.FC = () => {
    return <PredictorBase config={mhtcetConfig} />;
};

export default PageContent;
