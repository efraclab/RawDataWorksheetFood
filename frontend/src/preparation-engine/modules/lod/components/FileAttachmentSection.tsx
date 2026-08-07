import React from "react";
import WorksheetFileAttacher from "../../../../components/shared/WorksheetFileAttacher";

import type { AttachedFile } from "../../../../models/AttachedFile";

interface Props {

    files: AttachedFile[];

    onAdd: (newFiles: AttachedFile[]) => void;

    onRemove: (index: number) => void;

    isLocked: boolean;

}

const FileAttachmentSection: React.FC<Props> = ({
    files,
    onAdd,
    onRemove,
    isLocked
}) => {

    return (

        <WorksheetFileAttacher

            files={files}

            onAdd={onAdd}

            onRemove={onRemove}

            isLocked={isLocked}

            isForPrep={true}

            preparationType="lod"

            sectionLabel="Preparation Files"

            maxFiles={10}

        />

    );

};

export default FileAttachmentSection;