import { MessageType } from '../enums/enums';
export class Message
{
  constructor(
    public type?: MessageType,
    public value?:string
  ) { }
}