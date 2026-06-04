from pathlib import Path
import qrcode

# Change this URL if your repository name changes.
URL = "https://gosanmunjin.github.io/sternum-lungs-ar/ar.html"
OUT = Path(__file__).resolve().parents[1] / "qr" / "access-url.png"
qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=12, border=4)
qr.add_data(URL)
qr.make(fit=True)
img = qr.make_image(fill_color="black", back_color="white")
img.save(OUT)
print(f"saved {OUT}: {URL}")
