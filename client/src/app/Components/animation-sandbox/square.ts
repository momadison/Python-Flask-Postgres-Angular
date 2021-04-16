export class Square {
    constructor(private ctx: CanvasRenderingContext2D) {}
  
    draw(x: number, y: number, z: number) {
        this.ctx.fillRect(z * x, z * y, z, z);
    }

    move(y: number, z: number) {  
        const max = this.ctx.canvas.width / z;  
        for (let x = 0; x < max; x++) {
            this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
            this.draw(x, y, z);  
        }  
      }
      
  }