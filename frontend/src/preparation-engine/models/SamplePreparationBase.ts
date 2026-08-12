export interface SamplePreparationBase {

    id: number;

    label: string;

    completed: boolean;

    completedAt: string | null;

    steps: any[];

}