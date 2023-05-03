export enum ApiStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

export class QueueResult<T> {
  public status: ApiStatus = ApiStatus.ERROR;
  public message: string;
  public data: T | undefined;

  public success(data?: T, message?: string) {
    this.status = ApiStatus.SUCCESS;
    if (!message) {
      this.message = 'Success';
    }
    this.data = data;

    return this;
  }

  public error(message: string) {
    this.status = ApiStatus.ERROR;
    this.message = message;

    return this;
  }
}
