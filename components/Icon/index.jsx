import React from 'react';
import * as Icons from 'react-icons/md';

const Icon = ({ icon, ...props }) => {
    const Icon = Icons[icon]
    return <Icon {...props} />
};

export default Icon;
