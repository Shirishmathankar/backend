class APIError extends Error{

constructor(
    statusCode,
    message="something went wrong",
    errors=[],
    stack=""
){
  super(message)
  this.message=message
  this.errors=errors
  this.success=false
  this.statusCode=statusCode
  this.data=null
if(stack){
    this.stack=stack
}
else{
     Error.captureStackTrace(this,this.constructor)
}

}


}

export default APIError