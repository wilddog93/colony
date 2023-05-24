import React, { Dispatch, SetStateAction } from 'react';
import DekstopComponent from './DekstopComponent';
import { MenuProps } from '../../../utils/routes';

type Props = {
    sidebar: boolean;
    setSidebar: Dispatch<SetStateAction<boolean>>;
    menus: MenuProps[];
    className?: string;
}

function SidebarComponent({ sidebar, setSidebar, menus, className }: Props) {

    return (
        <React.Fragment>
            <DekstopComponent
                menus={menus}
                sidebar={sidebar}
                setSidebar={setSidebar}
                className={className}
            />
        </React.Fragment>
    )
}

export default SidebarComponent