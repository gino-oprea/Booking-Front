export class SubscriptionObject
{
    constructor(
        public id?: number,
        public subscriptionName?: string,
        public dateCreated?: Date,
        public dateModified?: Date,
        public monthlyPrice?: number,
        public yearlyPrice?: number,
        public monthlyBookingsNo?: number,
        public levelsNo?: number,
        public entitiesPerLevelNo?: number,
        public upgradePrice?: number,
        public upgradeMonths?: number
    ) { }
}