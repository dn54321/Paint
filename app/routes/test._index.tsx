import "reflect-metadata";

import type { MetaFunction } from "@remix-run/node";
import { rgbaToHexa } from "@uiw/color-convert";
import { RgbaColor } from "colord";
import { createRef, useEffect } from "react";
import { zinglExperimental, zinglLineGenerator } from "../../src/features/tools/utils/math2d.utils";
import { Position } from "../../src/types/geometry.types";

export const meta: MetaFunction = () => {
  return [
    { title: "Inkly" },
    { name: "description", content: "A place to draw together!" },
  ];
};



export default function Index() {
  const canvas1 = createRef<HTMLCanvasElement>();
  const canvas2 = createRef<HTMLCanvasElement>();
  const gridSize = 50;

  function fill(ctx: CanvasRenderingContext2D,  position: Position, color: RgbaColor = {r: 0, g: 0, b: 0, a: 255}) {
    ctx.fillStyle = rgbaToHexa(color);
    ctx.beginPath();
    ctx.rect(position.x/gridSize*1000, (gridSize-position.y-1)/gridSize*1000, 1000/gridSize, 1000/gridSize);
    ctx.fill();
  }

  function drawLine(ctx: CanvasRenderingContext2D, position0: Position, position1: Position) {
    const offset = 0;
    ctx.strokeStyle = "yellow";
    ctx.beginPath();
    ctx.moveTo((position0.x + offset)/gridSize*1000, 1000-(position0.y + offset)/gridSize*1000);
    ctx.lineTo((position1.x + offset)/gridSize*1000, 1000-(position1.y + offset)/gridSize*1000);
    ctx.stroke();
  }

  function drawGrid(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "grey";
    ctx.beginPath();
    ctx.rect(0, 0, 1000, 1000);
    ctx.stroke();


    for (let i = 0; i <= gridSize; ++i) {
      ctx.moveTo(i/gridSize*1000, 0);
      ctx.lineTo(i/gridSize*1000, 1000);
      ctx.stroke();

      ctx.moveTo(0, i/gridSize*1000);
      ctx.lineTo(1000, i/gridSize*1000);
      ctx.stroke();
    }
  }

  useEffect(() => {
    const ctx = canvas1.current?.getContext('2d');
    const ctx2 = canvas2.current?.getContext('2d');
    if (!ctx || !ctx2) return;
    
    // fill({x:0, y:0}, {r: 0, g: 0, b: 0, a: 1});
    // for (const point of zinglAALineThicknessGenerator({x:15, y:20}, {x:16, y:19}, 20)) {
    //   fill(point, {r: 0, g: 0, b: 0, a: 1});
    // }
    // // for (const point of zinglAALineThicknessGenerator({x:20, y:19}, {x:21, y:19}, 20)) {
    // //   fill(point, {r: 0, g: 0, b: 0, a: 1});
    // // }
    // // for (const point of zinglAALineThicknessGenerator({x:26, y:19}, {x:25, y:20}, 20)) {
    // //   fill(point, {r: 0, g: 0, b: 0, a: 1});
    // // }

    // for (const point of zinglExperimental({x:15, y:20}, {x:16, y:19}, 20)) {
    //   fill2(point, {r: 0, g: 0, b: 0, a: 1});
    // }
    // for (const point of zinglExperimental({x:20, y:19}, {x:21, y:19}, 20)) {
    //   fill2(point, {r: 0, g: 0, b: 0, a: 1});
    // }

    // for (const point of zinglExperimental({x:26, y:19}, {x:25, y:20}, 20)) {
    //   fill2(point, {r: 0, g: 0, b: 0, a: 1});
    // }

    const lines = [
      [{x:5, y:20}, {x:20, y:25}],
      [{x:5, y:5}, {x:10, y:10}],
      [{x:20, y:5}, {x:26, y:5}],
      [{x:30, y:5}, {x:30, y:10}],
    ]
    ctx.clearRect(0, 0, 1000, 1000);
    ctx2.clearRect(0, 0, 1000, 1000);

    for (const line of lines) {
      for (const point of zinglLineGenerator(line[0], line[1])) {
        fill(ctx, point, {r: 0, g: 0, b: 0, a: 1-(point?.brightness ?? 0)/255});
      }

      for (const point of zinglExperimental(line[0], line[1], 5)) {
        fill(ctx2, point, {r: 0, g: 0, b: 0, a: 1-(point?.brightness ?? 0)/255});
      }
    }


    drawGrid(ctx);
    drawGrid(ctx2);

    for (const line of lines) {
      drawLine(ctx, line[0], line[1])
      drawLine(ctx2, line[0], line[1])
    }

  } ,[canvas1]);



  return (
    <div className="w-full h-full flex gap-10 bg-slate-300">
      <canvas ref={canvas1} width="1000px" height="1000px" style={{
        width: "800px",
        height: "800px"
      }}/>
      <canvas ref={canvas2} width="1000px" height="1000px" style={{
        width: "800px",
        height: "800px"
      }}/>
    </div>
  );
}
