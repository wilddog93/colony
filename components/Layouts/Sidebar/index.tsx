import React, { Children } from 'react';
import Dekstop from './Dekstop';
import Mobile from './Mobile';
import Navigation from './Navigation';
import { routes } from '../../../utils/routes'

type Props = {
    sidebar: boolean,
    handleSidebar: () => void,
    images: string,
    header: string,
    children: any
}

function Sidebars({ sidebar, handleSidebar, images, header, children }: Props) {
    return (
        <React.Fragment>
            <Dekstop
                sidebar={sidebar}
                handleSidebar={handleSidebar}
                images={images}
                header={header}
            >
                {/* <Navigation routes={routes} /> */}
                {children}
            </Dekstop>
            <Mobile
                sidebar={sidebar}
                handleSidebar={handleSidebar}
                images={images}
                header={header}
            >
                {/* <Navigation routes={routes} /> */}
                {children}
            </Mobile>
        </React.Fragment>
    )
}

export default Sidebars