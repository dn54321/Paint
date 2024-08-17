
import { Resizable } from 're-resizable';
import { LayerWidget } from '../../../features/layer/components/widgets/layer-widget';

export default function LayerSideMenu() {
    return (
        <aside className="inset-y-0 left-0 hidden border-r bg-muted/10 sm:flex z-0 ">
            <Resizable 
                defaultSize={{width: "64rem"}} 
                minWidth="200px"
                className="w-64 flex flex-col items-center"
                enable={{ left:true }}
            >

                <LayerWidget/>
            </Resizable>
        </aside>
    )
}