import type * as React from "react";

import type { WorksheetDetail } from "../../../models/WorksheetDetail";
import type { WorksheetRequest } from "../../../models/WorksheetRequest";
import type { ParameterDetail } from "../../../models/ParameterDetail";
import type { PreparationData } from "../../../models/PreparationData";
import type { CalculationData } from "../../../models/CalculationData";
import type { WorksheetFileData } from "../../../models/WorksheetFileData";

import {
    mapLodDraftToPreparations,
    mapLodDraftToCalculations,
    mapLodDraftToFiles
} from "../mappers/lodMapper";

import type { PreparationEngineHandle }
    from "../types/PreparationEngineHandle";

export function collectFormDataForAPI({

    role,

    worksheetInfo,

    addedParameters,

    preparationRefs,

    bufferPreparationPerParam,

    mobilePhasePerParam,

    diluentPreparationsPerParam,

    systemSuitabilityPerParam,

    filesPerParam,

    additionalInfoPerParam,

    addedChemicals,

    addedStandards,

    addedInstruments

}: {

    role: string;

    worksheetInfo: WorksheetDetail;

    addedParameters: ParameterDetail[];

    preparationRefs: React.MutableRefObject<
        Record<number, PreparationEngineHandle | null>
    >;

    bufferPreparationPerParam: Record<number, any[]>;

    mobilePhasePerParam: Record<number, any[]>;

    diluentPreparationsPerParam: Record<number, any[]>;

    systemSuitabilityPerParam: Record<number, any[]>;

    filesPerParam: Record<number, any>;

    additionalInfoPerParam: Record<number, string>;

    addedChemicals: Record<number, any[]>;

    addedStandards: Record<number, any[]>;

    addedInstruments: Record<number, any[]>;

}): WorksheetRequest {

    return {

        role,

        worksheetId: worksheetInfo.sample.worksheetId,

        registrationInfo: {

            registrationNo: worksheetInfo.sample.registrationNo,

            sampleName: worksheetInfo.sample.sampleName,

            sampleCode: worksheetInfo.sample.sampleCode,

            sampleQuantity:
                worksheetInfo.sample.sampleQuantity ?? undefined,

            natureOfSample:
                worksheetInfo.sample.natureOfSample ?? undefined,

            numberOfParameters: addedParameters.length,

            dueDate: worksheetInfo.sample.dueDate,

            lab: worksheetInfo.sample.lab

        },

        documentInfo: {

            preparedBy: worksheetInfo.sample.preparedBy,

            revisionDate: worksheetInfo.sample.revisionDate,

            status: worksheetInfo.sample.status,

            approvedAt: worksheetInfo.sample.approvedAt

        },

        parameters: addedParameters.map(param => {

            const draft =
                preparationRefs.current[param.id]?.collectDraft();

            //
            // Build exactly like Drug Worksheet
            //

            const preparations: PreparationData[] = [];

            const calculations: CalculationData[] = [];

            const files: WorksheetFileData[] = [];

            //
            // LOD
            //

            preparations.push(

                ...mapLodDraftToPreparations(draft?.lod)

            );

            calculations.push(

                ...mapLodDraftToCalculations(draft?.lod)

            );

            files.push(

                ...mapLodDraftToFiles(draft?.lod)

            );

            const parameterFiles: WorksheetFileData[] =
                filesPerParam[param.id]?.param_level ?? [];

            parameterFiles.forEach(file => {

                files.push({

                    id: file.id,

                    preparationType: "parameter_file",

                    label: file.label,

                    fileName: file.fileName,

                    fileDataBase64: file.fileDataBase64

                });

            });

            //
            // Buffer / Mobile Phase / Diluent /
            // System Suitability / Parameter Files
            // will be added in the next steps.
            //


            // Buffer
            (bufferPreparationPerParam[param.id] ?? []).forEach(buffer => {

                preparations.push({

                    label: buffer.label,

                    preparationCategory: "buffer",

                    preparationType: null,

                    assignedStandardId: null,

                    steps: JSON.stringify(buffer.steps),

                    content: null

                });

            });

            // Mobile Phase
            (mobilePhasePerParam[param.id] ?? []).forEach(mp => {

                preparations.push({

                    label: mp.label,

                    preparationCategory: "mobile_phase",

                    preparationType: null,

                    assignedStandardId: null,

                    steps: null,

                    content: mp.content

                });

            });

            // Diluent
            (diluentPreparationsPerParam[param.id] ?? []).forEach(dp => {

                preparations.push({

                    label: dp.label,

                    preparationCategory: "diluent",

                    preparationType: null,

                    assignedStandardId: null,

                    steps: null,

                    content: dp.content

                });

            });

            // System Suitability
            (systemSuitabilityPerParam[param.id] ?? []).forEach(ss => {

                preparations.push({

                    label: ss.label,

                    preparationCategory: "system_suitability",

                    preparationType: null,

                    assignedStandardId: null,

                    steps: JSON.stringify(ss.steps),

                    content: null

                });

            });

            const instruments =
                addedInstruments[param.id] ?? [];

            const chemicals =
                addedChemicals[param.id] ?? [];

            const standards =
                addedStandards[param.id] ?? [];

            return {

                ...param,

                preparationCompletedAt: param.preparationCompletedAt,
                preparationCompletedBy: param.preparationCompletedBy,

                additional_info:
                    additionalInfoPerParam[param.id] ?? null,

                additionalInfo:
                    additionalInfoPerParam[param.id] ?? null,

                showAdditionalInfo:
                    !!additionalInfoPerParam[param.id],

                instruments,

                chemicals,

                standards,

                preparations,

                calculations,

                files

            };

        })

    };

}