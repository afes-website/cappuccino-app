export default class JWT {
  content: string;
  uid_key: string;
  constructor(_content: string) {
    this.content = _content;
  }

  get header(): { [key: string]: string } {
    return JSON.parse(atob(this.content.split(".")[0]));
  }

  get payload(): { [key: string]: string } {
    return JSON.parse(atob(this.content.split(".")[1]));
  }

  isValidAt(now: Date = new Date()): boolean {
    const not_valid_before: Date = new Date(Number(this.payload["iat"]) * 1000);
    const expiration: Date = new Date(Number(this.payload["exp"]) * 1000);
    return not_valid_before <= now && now <= expiration;
  }

  get userId(): string {
    return this.payload.user_id;
  }
}
