export interface Job {
    id: Number;
    jobStatus: string;
    source: string;
    title: string;
    linkAddress: string;
    publishedDate: Date;
    createdDate: Date;
    lastSeen: Date;
    lastUpdated: Date;
    notes: string;
    description: string;
}
