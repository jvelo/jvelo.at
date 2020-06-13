import {NProgress} from '@tanem/react-nprogress';
import React from 'react';
import Theme from '../styles/theme'

type Props = {
    isRouteChanging: boolean;
    loadingKey: string | null;
};

const PageLoading: React.FC<Props> = ({isRouteChanging, loadingKey}) => {
    return <NProgress minimum={0} isAnimating={isRouteChanging} key={loadingKey || ''}>
        {({progress, animationDuration}) => {
            return <div
                style={{
                    pointerEvents: 'none',
                }}
            >
                <div
                    style={{
                        background: Theme.colors.primary,
                        height: 15,
                        left: 0,
                        marginLeft: progress === 0 ? '0' : `${(-1 + progress) * 100}%`,
                        position: 'fixed',
                        top: 0,
                        transition: progress <= 0.1 ? 'none' : `margin-left ${animationDuration}ms linear`,
                        width: '100vw',
                        zIndex: isRouteChanging ? 10000 : 1031,
                    }}
                >
                </div>
            </div>
        }}
    </NProgress>
};

export default PageLoading;
