import fitz
import pytesseract
pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe'  
import io
from PIL import Image
import os
from pypdf import PdfReader
import docx
import cv2
import numpy as np
def extract_text_from_pdf(pdf_path, lang):
    pdf_document = fitz.open(pdf_path)
    text_data = ""

    for page_num in range(pdf_document.page_count):
        page = pdf_document.load_page(page_num)
        image_bytes = page.get_pixmap().tobytes("png")
        text = pytesseract.image_to_string(Image.open(io.BytesIO(image_bytes)),lang=lang)
        text_data += text + "\n"

    pdf_document.close()
    return text_data

# def extract_images(pdf_path):
#     pdf = fitz.open(pdf_path)
#     for page in range (pdf.page_count):
#         imageList = pdf[page].get_images()
#         os.makedirs('backend/output images', exist_ok=True)
#         if imageList:
#             for idx, img in enumerate(imageList, start=1):
#                 data = pdf.extract_image(img[0])
#                 with Image.open(io.BytesIO(data.get("image"))) as image:
#                     image.save(f'backend/output images/{page+1}.{data.get("ext")}', mode='wb')

def save_pdf(input_text, output_path):
    pdf_document = fitz.open()
    page = pdf_document.new_page()
    text_area = fitz.Rect(50, 50, 550, 800)
    page.insert_text(text_area, input_text)
    pdf_document.save(output_path)
    pdf_document.close()

# def extract_images(pdf_path):
#     reader = PdfReader(pdf_path)
#     page = reader.pages[0]
#     for i in  page.images:
#         with open(i.name, 'wb') as f:
#             f.write(i.data)

def extract_text_and_save_to_word(pdf_path, word_path, lang="eng"): 
    text_data = extract_text_from_pdf(pdf_path, lang)
    document = docx.Document()
    document.add_paragraph(text_data)
    document.save(word_path)

def extract_images(pdf_path):
    """Extracts images from a PDF and saves them to the 'output_images' folder."""

    images = []
    output_dir = "output_images"
    os.makedirs(output_dir, exist_ok=True)  # Ensure output directory exists

    with fitz.open(pdf_path) as doc:
        for page_num, page in enumerate(doc):
            pix = page.get_pixmap()
            image = cv2.imdecode(np.frombuffer(pix.tobytes("png"), np.uint8), -1)

            # Efficiently detect text regions using adaptive thresholding
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 11, 2)

            # Extract non-text regions as potential images
            contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for cntr in contours:
                x, y, w, h = cv2.boundingRect(cntr)
                potential_image = image[y:y+h, x:x+w]
                images.append(potential_image)

            # Save extracted images with unique filenames
            for i, potential_image in enumerate(images):
                image_filename = f"page_{page_num + 1}_{i + 1}.png"
                image_path = os.path.join(output_dir, image_filename)
                cv2.imwrite(image_path, potential_image)           