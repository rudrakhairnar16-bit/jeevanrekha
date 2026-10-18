/** Bounded asynchronous WebGL elapsed queries. Never drives animation or a polling render loop. */
type TimerExtension={TIME_ELAPSED_EXT:number;GPU_DISJOINT_EXT:number};
export class GpuTimer{
 private ext:TimerExtension|null;private pending:WebGLQuery[]=[];private current:WebGLQuery|null=null;
 lastMs:number|null=null;samples=0;disjointSamples=0;
 constructor(private gl:WebGL2RenderingContext){this.ext=gl.getExtension('EXT_disjoint_timer_query_webgl2') as TimerExtension|null;}
 get supported(){return !!this.ext;}
 begin(){
  const gl=this.gl,ext=this.ext;if(!ext||gl.isContextLost())return;
  if(gl.getParameter(ext.GPU_DISJOINT_EXT)){this.pending.forEach(q=>gl.deleteQuery(q));this.pending=[];this.lastMs=null;this.disjointSamples++;return;}
  while(this.pending.length&&gl.getQueryParameter(this.pending[0],gl.QUERY_RESULT_AVAILABLE)){
   const q=this.pending.shift()!;const nanoseconds=gl.getQueryParameter(q,gl.QUERY_RESULT) as number;gl.deleteQuery(q);if(Number.isFinite(nanoseconds)&&nanoseconds>=0){this.lastMs=nanoseconds/1e6;this.samples++;}
  }
  if(this.pending.length>=4)return;this.current=gl.createQuery();if(this.current)gl.beginQuery(ext.TIME_ELAPSED_EXT,this.current);
 }
 end(){if(!this.current||!this.ext)return;this.gl.endQuery(this.ext.TIME_ELAPSED_EXT);this.pending.push(this.current);this.current=null;}
 dispose(){if(this.current){this.end();}this.pending.forEach(q=>this.gl.deleteQuery(q));this.pending=[];}
}
