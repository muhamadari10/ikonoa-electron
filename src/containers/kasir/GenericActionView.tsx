import React from 'react';
import { ButtonIcon, RenderIf } from 'react-rainbow-components';
import { MdAdd, MdRemove } from "react-icons/md";

interface ActionProps {
    enableAdd: boolean,
    enableRemove: boolean
    add: () => void,
    remove: () => void
}

export const GenericActionView: React.FC<any & ActionProps> = (props: any) => {
    const { enableAdd, enableRemove,add, remove } = props

    return (
        <div className="rainbow-p-vertical_large rainbow-p-left_x-large rainbow-flex rainbow-align_center">
            <RenderIf isTrue={enableAdd}>
                <div className="rainbow-p-right_large">
                    <ButtonIcon variant="success" icon={<MdAdd />} onClick={() => {
                        add()
                    }} />
                </div>
            </RenderIf>

            <RenderIf isTrue={enableRemove}>
                <div className="rainbow-p-right_large">
                    <ButtonIcon variant="border-filled" icon={<MdRemove />} onClick={() => {
                        remove()
                    }} />
                </div>
            </RenderIf>
        </div>
    )
}
