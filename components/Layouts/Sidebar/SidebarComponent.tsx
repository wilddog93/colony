import React, { Dispatch, SetStateAction } from 'react';
import DekstopComponent from './DekstopComponent';
import { MenuProps } from '../../../utils/routes';

type Props = {
    sidebar: boolean;
    setSidebar: Dispatch<SetStateAction<boolean>>;
    menus: MenuProps[];
}

function SidebarComponent({ sidebar, setSidebar, menus }: Props) {

    return (
        <React.Fragment>
            <DekstopComponent
                menus={menus}
                sidebar={sidebar}
                setSidebar={setSidebar}
            />
        </React.Fragment>
    )
}

export default SidebarComponent