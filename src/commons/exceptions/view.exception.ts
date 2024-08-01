interface ViewExceptionContext {
  message?: string;
}

export class ViewException extends Error {
  constructor(private context: ViewExceptionContext) {
    super(context.message);
  }

  getContext(): any {
    return this.context;
  }
}
