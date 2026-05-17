import React, { useEffect, useRef } from "react";
import p5 from "p5";

type PageRankNode = {
  id: number;
  name: string;
  x: number;
  y: number;
  pr: number;
};

type PageRankEdge = {
  from: number;
  to: number;
};

export default function InteractivePageRank() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let sketchInstance: p5 | null = null;

    const sketch = (s: p5) => {
      let nodes: PageRankNode[] = [];
      let edges: PageRankEdge[] = [];
      let dSlider: p5.Element;
      let stepBtn: p5.Element;
      let addNodeBtn: p5.Element;
      let addLinkBtn: p5.Element;
      let resetBtn: p5.Element;
      let iterationCount = 0;
      let draggedNode: PageRankNode | null = null;

      let bgCol: p5.Color;
      let panelCol: p5.Color;
      let textCol: p5.Color;
      let highlightCol: p5.Color;

      const setupGraph = () => {
        nodes = [];
        edges = [];
        iterationCount = 0;

        addNode("Site 0 (Blog)", 200, 200);
        addNode("Site 1 (News)", 500, 150);
        addNode("Site 2 (Wiki)", 400, 400);
        addNode("Site 3 (Forum)", 150, 450);

        edges.push({ from: 0, to: 1 });
        edges.push({ from: 0, to: 2 });
        edges.push({ from: 1, to: 2 });
        edges.push({ from: 2, to: 0 });
        edges.push({ from: 3, to: 2 });
        edges.push({ from: 2, to: 3 });

        normalizePR();
      };

      const addNode = (nameLabel: string | null, xPos: number, yPos: number) => {
        const id = nodes.length;
        const label = nameLabel && nameLabel.length > 0 ? nameLabel : `Site ${id}`;
        nodes.push({ id, name: label, x: xPos, y: yPos, pr: 0 });
        normalizePR();
      };

      const addWebsite = () => {
        const siteName = window.prompt(
          "Enter a name for the new website:",
          `Site ${nodes.length}`,
        );
        if (siteName) {
          addNode(siteName, s.random(100, 600), s.random(100, 600));
        }
      };

      const addHyperlink = () => {
        const fromId = parseInt(
          window.prompt(
            `Enter the ID of the SOURCE site (0 to ${nodes.length - 1}):`,
          ) ||
            "",
          10,
        );
        const toId = parseInt(
          window.prompt(
            `Enter the ID of the DESTINATION site (0 to ${nodes.length - 1}):`,
          ) ||
            "",
          10,
        );

        if (
          Number.isInteger(fromId) &&
          Number.isInteger(toId) &&
          fromId >= 0 &&
          toId >= 0 &&
          fromId < nodes.length &&
          toId < nodes.length
        ) {
          if (fromId !== toId) {
            edges.push({ from: fromId, to: toId });
            iterationCount = 0;
            normalizePR();
          } else {
            window.alert("A site cannot link to itself in this simulation.");
          }
        } else {
          window.alert("Invalid IDs.");
        }
      };

      const normalizePR = () => {
        const N = nodes.length;
        if (N === 0) return;
        for (const n of nodes) {
          n.pr = 1.0 / N;
        }
      };

      const getOutDegree = (nodeId: number) => {
        return edges.filter((e) => e.from === nodeId).length;
      };

      const stepPageRank = () => {
        const d = Number(dSlider.value());
        const N = nodes.length;
        const newPR: number[] = [];
        const baseValue = (1 - d) / N;

        for (let i = 0; i < N; i += 1) {
          let sum = 0;
          const incomingEdges = edges.filter((e) => e.to === i);

          for (const e of incomingEdges) {
            const outDegree = getOutDegree(e.from);
            const prValue = nodes[e.from].pr;
            if (outDegree > 0) {
              sum += prValue / outDegree;
            } else {
              sum += prValue / N;
            }
          }
          newPR[i] = baseValue + d * sum;
        }

        for (let i = 0; i < N; i += 1) {
          nodes[i].pr = newPR[i];
        }
        iterationCount += 1;
      };

      const drawInferences = () => {
        s.fill(panelCol);
        s.stroke(100);
        s.rect(770, 280, 310, 380, 10);

        s.fill(highlightCol);
        s.noStroke();
        s.textSize(18);
        s.textStyle(s.BOLD);
        s.text("Algorithm Inferences", 785, 295);

        s.fill(textCol);
        s.textSize(13);
        s.textStyle(s.NORMAL);
        s.textLeading(20);

        if (nodes.length === 0) return;

        const sortedNodes = [...nodes].sort((a, b) => b.pr - a.pr);
        const topNode = sortedNodes[0];
        const incomingCount = edges.filter((e) => e.to === topNode.id).length;
        const d = Number(dSlider.value());

        let inferenceText = "";

        if (iterationCount === 0) {
          inferenceText +=
            "Waiting for iterations to begin. All websites have equal probability (1/N).\n\n";
          inferenceText +=
            "Click Step Iteration to watch probability flow through the hyperlinks.";
        } else {
          inferenceText += `Top Result: ${topNode.name}\n`;
          inferenceText +=
            `This website is currently recommended as the top result with a PR score of ${topNode.pr.toFixed(
              3,
            )}.\n\n`;

          inferenceText += "Why is it ranking so high?\n";
          if (incomingCount > 1) {
            inferenceText += `- It acts as an authority node with ${incomingCount} incoming hyperlinks.\n`;
          } else if (incomingCount === 1) {
            inferenceText +=
              "- It has a single incoming link from a highly ranked site.\n";
          } else {
            inferenceText +=
              "- It has no incoming links and relies on random jumps.\n";
          }

          if (d < 0.3) {
            inferenceText +=
              `\nNote on damping factor:\nA very low damping factor (${d.toFixed(
                2,
              )}) reduces the impact of hyperlinks.`;
          } else if (d > 0.8) {
            inferenceText +=
              `\nLink economy:\nA high damping factor (${d.toFixed(
                2,
              )}) makes link structure dominate rankings.`;
          }
        }

        s.text(inferenceText, 785, 335, 280, 350);
      };

      const drawArrow = (node1: PageRankNode, node2: PageRankNode) => {
        const r1 = (40 + node1.pr * 150) / 2;
        const r2 = (40 + node2.pr * 150) / 2;
        const angle = s.atan2(node2.y - node1.y, node2.x - node1.x);

        const x1 = node1.x + s.cos(angle) * (r1 + 5);
        const y1 = node1.y + s.sin(angle) * (r1 + 5);
        const x2 = node2.x - s.cos(angle) * (r2 + 5);
        const y2 = node2.y - s.sin(angle) * (r2 + 5);

        s.stroke(150, 150, 180, 150);
        s.strokeWeight(2);
        s.line(x1, y1, x2, y2);

        const arrowSize = 8;
        s.push();
        s.translate(x2, y2);
        s.rotate(angle);
        s.fill(150, 150, 180);
        s.noStroke();
        s.triangle(0, 0, -arrowSize * 2, arrowSize, -arrowSize * 2, -arrowSize);
        s.pop();
      };

      s.setup = () => {
        const canvas = s.createCanvas(1100, 700);
        canvas.parent(containerRef.current as HTMLDivElement);
        canvas.style("position", "absolute");
        canvas.style("top", "0");
        canvas.style("left", "0");
        canvas.style("border-radius", "14px");

        bgCol = s.color(20, 22, 30);
        panelCol = s.color(30, 34, 46);
        textCol = s.color(230, 230, 240);
        highlightCol = s.color(0, 220, 255);

        const startX = 770;

        stepBtn = s.createButton("Step Iteration");
        stepBtn.position(startX, 60);
        stepBtn.mousePressed(stepPageRank);
        stepBtn.parent(containerRef.current as HTMLDivElement);

        addNodeBtn = s.createButton("Add Website");
        addNodeBtn.position(startX + 120, 60);
        addNodeBtn.mousePressed(addWebsite);
        addNodeBtn.parent(containerRef.current as HTMLDivElement);

        addLinkBtn = s.createButton("Add Link");
        addLinkBtn.position(startX, 100);
        addLinkBtn.mousePressed(addHyperlink);
        addLinkBtn.parent(containerRef.current as HTMLDivElement);

        resetBtn = s.createButton("Reset Web");
        resetBtn.position(startX + 120, 100);
        resetBtn.mousePressed(setupGraph);
        resetBtn.parent(containerRef.current as HTMLDivElement);

        dSlider = s.createSlider(0.01, 0.99, 0.85, 0.01);
        dSlider.position(startX, 170);
        dSlider.style("width", "250px");
        dSlider.parent(containerRef.current as HTMLDivElement);

        setupGraph();
      };

      s.mousePressed = () => {
        for (const n of nodes) {
          const distance = s.dist(s.mouseX, s.mouseY, n.x, n.y);
          const radius = 40 + n.pr * 150;
          if (distance < radius / 2) {
            draggedNode = n;
            break;
          }
        }
      };

      s.mouseDragged = () => {
        if (draggedNode && s.mouseX < 750) {
          draggedNode.x = s.mouseX;
          draggedNode.y = s.mouseY;
        }
      };

      s.mouseReleased = () => {
        draggedNode = null;
      };

      s.draw = () => {
        s.background(bgCol);

        s.fill(panelCol);
        s.noStroke();
        s.rect(750, 0, 350, s.height);

        s.fill(textCol);
        s.textSize(24);
        s.textStyle(s.BOLD);
        s.textAlign(s.LEFT, s.TOP);
        s.text("Search Engine Engine", 770, 20);

        s.textSize(14);
        s.textStyle(s.NORMAL);
        s.text(`Damping Factor (d): ${Number(dSlider.value()).toFixed(2)}`, 770, 150);
        s.text(`Current Iteration: ${iterationCount}`, 770, 210);
        s.text(`Total Indexed Sites (N): ${nodes.length}`, 770, 240);

        drawInferences();

        for (const e of edges) {
          drawArrow(nodes[e.from], nodes[e.to]);
        }

        s.textAlign(s.CENTER, s.CENTER);
        const maxPR = Math.max(0.01, ...nodes.map((n) => n.pr));

        for (const n of nodes) {
          const radius = 40 + n.pr * 150;
          const intensity = s.map(n.pr, 0, maxPR, 0.2, 1);
          const lowCol = s.color(50, 100, 200);
          const highCol = s.color(255, 50, 150);
          const nodeCol = s.lerpColor(lowCol, highCol, intensity);

          const ctx = s.drawingContext as CanvasRenderingContext2D;
          if (n.pr === maxPR && nodes.length > 0) {
            ctx.shadowBlur = 30;
            ctx.shadowColor = String(nodeCol);
          } else {
            ctx.shadowBlur = 0;
          }

          s.fill(nodeCol);
          s.stroke(255);
          s.strokeWeight(2);
          s.ellipse(n.x, n.y, radius, radius);
          ctx.shadowBlur = 0;

          s.fill(255);
          s.noStroke();
          s.textSize(16);
          s.textStyle(s.BOLD);
          s.text(n.name, n.x, n.y - 10);

          s.textSize(12);
          s.textStyle(s.NORMAL);
          s.text(`ID: ${n.id} | PR: ${n.pr.toFixed(3)}`, n.x, n.y + 12);
        }
      };
    };

    sketchInstance = new p5(sketch);

    return () => {
      if (sketchInstance) {
        sketchInstance.remove();
      }
    };
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #101423 0%, #1b2138 100%)",
        borderRadius: "16px",
        padding: "16px",
        boxShadow: "0 10px 30px rgba(16, 20, 35, 0.4)",
        overflowX: "auto",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "1100px",
          height: "700px",
          position: "relative",
          margin: "0 auto",
        }}
      />
    </div>
  );
}
