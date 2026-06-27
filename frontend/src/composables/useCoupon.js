// Génère le visuel du coupon de réduction (canvas) aux couleurs Cook Africa, et son téléchargement.

const RED = '#7a0e0e';
const RED_DARK = '#4a0808';
const GOLD = '#d4af37';
const CREAM = '#fdf8ef';
const INK = '#2b1a12';

export function formatDateFR(date) {
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function generateCouponCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `CA-${code}`;
}

export function drawCoupon(canvas, { offerText, validUntilLabel, code, address, phones }) {
  const W = 1000;
  const H = 1400;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  ctx.textAlign = 'center';

  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 14;
  ctx.strokeRect(20, 20, W - 40, H - 40);

  const bannerH = 260;
  const grad = ctx.createLinearGradient(0, 0, 0, bannerH);
  grad.addColorStop(0, RED);
  grad.addColorStop(1, RED_DARK);
  ctx.fillStyle = grad;
  ctx.fillRect(40, 40, W - 80, bannerH);

  ctx.fillStyle = GOLD;
  ctx.font = 'bold 64px Georgia, "Times New Roman", serif';
  ctx.fillText('COOK AFRICA', W / 2, 150);
  ctx.font = '28px Georgia, "Times New Roman", serif';
  ctx.fillStyle = CREAM;
  ctx.fillText("L'univers des mets africains", W / 2, 200);

  ctx.strokeStyle = RED;
  ctx.setLineDash([10, 10]);
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(60, bannerH + 70);
  ctx.lineTo(W - 60, bannerH + 70);
  ctx.stroke();
  ctx.setLineDash([]);

  const [headline, ...restWords] = offerText.split(' ');
  ctx.fillStyle = RED;
  ctx.font = 'bold 130px Georgia, "Times New Roman", serif';
  ctx.fillText(headline, W / 2, bannerH + 260);

  ctx.font = 'bold 46px Georgia, "Times New Roman", serif';
  ctx.fillStyle = INK;
  ctx.fillText(restWords.join(' '), W / 2, bannerH + 330);

  ctx.font = '34px Georgia, "Times New Roman", serif';
  ctx.fillStyle = INK;
  ctx.fillText('À présenter en restaurant', W / 2, bannerH + 420);

  ctx.font = 'bold 38px Georgia, "Times New Roman", serif';
  ctx.fillStyle = RED;
  ctx.fillText(`Valable jusqu'au ${validUntilLabel}`, W / 2, bannerH + 480);

  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 4;
  ctx.strokeRect(W / 2 - 220, bannerH + 540, 440, 100);
  ctx.font = 'bold 44px "Courier New", monospace';
  ctx.fillStyle = RED_DARK;
  ctx.fillText(code, W / 2, bannerH + 605);

  ctx.fillStyle = RED;
  ctx.fillRect(40, H - 220, W - 80, 160);
  ctx.fillStyle = GOLD;
  ctx.font = '30px Georgia, "Times New Roman", serif';
  ctx.fillText('— LE restaurant qui rassemble —', W / 2, H - 160);
  ctx.font = '24px Georgia, "Times New Roman", serif';
  ctx.fillStyle = CREAM;
  ctx.fillText(address || 'Angré 8ème tranche, KFC, derrière la station Shell', W / 2, H - 115);
  ctx.fillText((phones || []).join('  —  '), W / 2, H - 80);
}

export function downloadCanvas(canvas, filename) {
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
