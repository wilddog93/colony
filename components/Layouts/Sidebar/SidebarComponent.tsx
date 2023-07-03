import React, { Dispatch, SetStateAction } from 'react';
import DekstopComponent from './DekstopComponent';
import { MenuProps } from '../../../utils/routes';

type Props = {
    sidebar: boolean;
    setSidebar: Dispatch<SetStateAction<boolean>>;
    menus: MenuProps[];
    className?: string;
    token?: any;
    defaultImage?: string;
    isSelectProperty?: boolean;
    propertyId?: number | string | any;
}

function SidebarComponent({ sidebar, setSidebar, menus, className, token, defaultImage, isSelectProperty, propertyId }: Props) {

    return (
        <React.Fragment>
            <DekstopComponent
                menus={menus}
                sidebar={sidebar}
                setSidebar={setSidebar}
                className={className}
                token={token}
                defaultImage={defaultImage}
                isSelectProperty={isSelectProperty}
                propertyId={propertyId}
            />
        </React.Fragment>
    )
}

export default SidebarComponent