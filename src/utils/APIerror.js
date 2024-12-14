class APIError extends Error{

constructor(
    statusCode,
    message="something went wrong",
    errors=[],
    statck=""
){
  super(message)
  this.message=message
  this.errors=errors
  this.success=false
  this.statusCode=statusCode
  this.data=null
if(statck){
    this.stack=statck
}
else{
     Error.captureStackTrace(this,this.constructor)
}

}


}

export default APIError