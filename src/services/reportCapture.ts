/**
 * @file reportCapture.ts
 * @description 리포트 섹션을 고해상도 이미지로 캡처하고 저장/공유하는 기능을 담당하는 서비스입니다.
 * html2canvas를 사용하여 DOM 요소를 캔버스로 변환하며, 외부 이미지 및 스타일 예외 처리를 수행합니다.
 */

import html2canvas from "html2canvas";

/**
 * 리포트 요소를 캡처하여 Blob 형태의 고해상도 이미지를 생성합니다.
 * 
 * @param reportRef 캡처할 DOM 요소의 Ref
 * @returns {Promise<Blob | null>} 생성된 이미지 Blob
 */
export const captureReportBlob = async (reportElement: HTMLElement | null): Promise<Blob | null> => {
  if (!reportElement) return null;

  // 15초 타임아웃 설정
  const overallTimeout = new Promise<null>((_, reject) => 
    setTimeout(() => reject(new Error("Capture Timeout")), 15000)
  );

  const captureProcess = (async () => {
    // 폰트 로딩 대기
    if (document.fonts) await document.fonts.ready;
    
    // 이미지 로딩 대기
    const images = reportElement.querySelectorAll("img");
    await Promise.all(Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
        setTimeout(resolve, 5000);
      });
    }));

    // 안정적인 렌더링을 위한 지연
    await new Promise(resolve => setTimeout(resolve, 1000));

    const canvas = await html2canvas(reportElement, {
      backgroundColor: "#FDFCF0",
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: -window.scrollY,
      onclone: async (clonedDoc) => {
        const el = clonedDoc.getElementById("report-content");
        if (!el) return;
        
        // 클론된 DOM에서 이미지 플레이스홀더 교체 및 스타일 최적화
        const clonedImages = el.querySelectorAll("img");
        clonedImages.forEach((img) => {
          if (img.src.startsWith("data:")) {
            img.style.display = "none";
            return;
          }

          const parent = img.parentElement;
          if (!parent) return;

          const family = img.closest("[data-family]")?.getAttribute("data-family") || "기본";
          const themes: Record<string, { bg: string; color: string; image: string }> = {
            "플로랄": { bg: "#FAE8EF", color: "#A03060", image: "/product_1.jpg" },
            "우디": { bg: "#EDE8E0", color: "#7A5C3A", image: "/product_2.jpg" },
            "머스크": { bg: "#E8EAF0", color: "#4A5070", image: "/product_1.jpg" },
            "시트러스": { bg: "#FEF5E0", color: "#8A6010", image: "/product_4.jpg" },
            "앰버": { bg: "#F5EAD8", color: "#8A5520", image: "/product_3.jpg" },
            "프레쉬": { bg: "#E4F2EC", color: "#2A6B4A", image: "/product_4.jpg" },
            "기본": { bg: "#F0EDE8", color: "#6B4423", image: "/product_1.jpg" },
          };
          const theme = themes[family] || themes["기본"];

          const placeholder = clonedDoc.createElement("div");
          placeholder.style.cssText = `
            width: 100%; height: 100%; background-color: ${theme.bg};
            color: ${theme.color}; display: flex; flex-direction: column;
            align-items: center; justify-content: center; position: relative;
            overflow: hidden; border-radius: 2px;
          `;

          const bgImg = clonedDoc.createElement("img");
          bgImg.src = window.location.origin + theme.image;
          bgImg.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 0;`;
          placeholder.appendChild(bgImg);

          const overlay = clonedDoc.createElement("div");
          overlay.style.cssText = `position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: ${theme.bg}; opacity: 0.8; z-index: 1;`;
          placeholder.appendChild(overlay);

          const badge = clonedDoc.createElement("div");
          badge.textContent = family;
          badge.style.cssText = `font-size: 11px; font-weight: 600; letter-spacing: 0.15em; border: 1px solid ${theme.color}; border-radius: 999px; padding: 5px 14px; background-color: rgba(255, 255, 255, 0.2); position: relative; z-index: 3; text-transform: uppercase; margin-top: auto; margin-bottom: 24px;`;
          placeholder.appendChild(badge);

          img.style.display = "none";
          parent.appendChild(placeholder);
        });
        
        el.style.width = "1000px";
        el.style.padding = "60px";
        el.style.filter = "none";
        el.style.transform = "none";

        const header = clonedDoc.createElement("div");
        header.style.cssText = "display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:60px; border-bottom:1px solid rgba(107,68,35,0.1); padding-bottom:20px;";
        header.innerHTML = `
          <div style="display: flex; align-items: center;">
            <div>
              <div style="font-family: 'Playfair Display', serif; font-size:28px; font-weight: 300; letter-spacing: 0.25em; color:#6B4423; text-transform: uppercase; line-height: 1;">OLFIT</div>
              <div style="font-size: 10px; color: #6B4423; margin-top: 8px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase;">Visual Identity Matching</div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 11px; font-weight: 600; color: #6B4423; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 4px;">Precision Analysis Report</div>
            <div style="font-size:10px; color:rgba(107, 68, 35, 0.5); letter-spacing: 0.05em;">${new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        `;
        el.prepend(header);
      }
    });

    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png", 1.0);
    });
  })();

  return Promise.race([captureProcess, overallTimeout]) as Promise<Blob | null>;
};

/**
 * 생성된 이미지를 네이티브 공유, 클립보드 복사 또는 다운로드 방식으로 사용자에게 제공합니다.
 * 
 * @param blob 이미지 Blob
 */
export const shareOrDownloadImage = async (blob: Blob): Promise<"shared" | "copied" | "downloaded" | "failed"> => {
  const file = new File([blob], `Olfit_Analysis_${Date.now()}.png`, { type: "image/png" });

  // 1. 네이티브 공유 API (모바일 등)
  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        files: [file],
        title: "Olfit Scent Analysis Report",
        text: "나만의 고유한 향기 아우라 분석 결과를 확인해보세요.",
      });
      return "shared";
    } catch (shareErr) {
      if ((shareErr as Error).name === "AbortError") return "failed"; 
      console.warn("Share failed", shareErr);
    }
  }

  // 2. 클립보드 복사
  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([item]);
      return "copied";
    }
  } catch (clipboardErr) {
    console.warn("Clipboard failed", clipboardErr);
  }

  // 3. 강제 다운로드
  try {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Olfit_Analysis_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(url), 100);
    return "downloaded";
  } catch (downloadErr) {
    console.error("Download failed", downloadErr);
    return "failed";
  }
};

// EOF: reportCapture.ts