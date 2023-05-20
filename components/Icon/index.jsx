import React from 'react';
import * as IconMD from 'react-icons/md';
import * as IconFA from 'react-icons/md';

const Icon = ({ icon, ...props }) => {
    const Icon = IconMD[icon] || IconFA[icon]
    return <Icon {...props} />
};

export default Icon;
