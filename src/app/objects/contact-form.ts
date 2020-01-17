export class ContactForm
{
  constructor(
    public firstName?: string,
    public lastName?: string,
    public email?: string,
    public phone?: string,
    public subject?: string,
    public message?:string
  ) { }
}