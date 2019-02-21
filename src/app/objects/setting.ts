export class Setting
{
    constructor(
        public settingName?: string,
        public settingValue?: string,
        public error?: string,
        public errorDetailed?: string
    )
    {

    }
}