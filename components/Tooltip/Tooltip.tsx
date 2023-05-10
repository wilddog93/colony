import React from 'react';

interface TooltipProps {
    children?: JSX.Element | string | null | undefined;
    tooltip?: JSX.Element | string | null | undefined;
    className?: string;
    classTooltip?: string;
    position?: string | "top" | 'bottom' | 'left' | 'right';
    color?: string | "dark" | "light";
}

const Tooltip: React.FC<TooltipProps> = ({ 
    children, 
    className = '', 
    classTooltip, 
    position = "top", 
    color = "dark", 
    tooltip
}) => {
    // const { children, className, classTooltip, position, color, tooltip } = props;
    return (
        <button type='button' className={'tooltip ' + className}>
            {children}
            <span 
                data-position={position} 
                data-color={color} 
                className={'tooltiptext ' + classTooltip}>{tooltip}</span>
        </button>
    );
};

export default Tooltip;