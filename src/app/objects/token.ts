export class Token
{
  constructor(
    public access_token: string,
    public expires_in: number,    
    public scope: string,
    public token_type: string,
    public token_generated: Date
  ) { }
}   