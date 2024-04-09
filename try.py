import layoutparser as lp
import cv2

image = cv2.imread("backend\\output images\\1.jpeg")
image = image[..., ::-1]

model = lp.models.Detectron2LayoutModel("C:\\Users\\ayamu\\Downloads\\config.yaml", 
                                 extra_config=["MODEL.ROI_HEADS.SCORE_THRESH_TEST", 0.8],
                                 label_map={0: "Text", 1: "Title", 2: "List", 3:"Table", 4:"Figure"})

layout = model.detect(image)
lp.draw(image,layout,box_width=3)

# import fitz
# import os
# from PIL import Image
# from io import BytesIO
# from transformers import LayoutLMv3Processor, LayoutLMv3ForTokenClassification
# import pytesseract
# pytesseract.pytesseract.tesseract_cmd = 'C:\\Program Files\\Tesseract-OCR\\tesseract.exe' 
# import torch

# max_sequence_length = 512

# file_path = 'backend\\test pdfs\\a.pdf'
# pdf_file = fitz.open(file_path)
# page_nums = len(pdf_file)
# images_list = []

# for pg_num in range(page_nums):
#     page_content = pdf_file[pg_num]
#     images_list.extend(page_content.get_images())

# if len(images_list) == 0:
#     raise ValueError(f'No images in {file_path}')

# processor = LayoutLMv3Processor.from_pretrained("microsoft/layoutlmv3-base")
# model = LayoutLMv3ForTokenClassification.from_pretrained("microsoft/layoutlmv3-base")

# for i, image in enumerate(images_list, start=1):
#     xref = image[0]
#     base_image = pdf_file.extract_image(xref)
#     image_bytes = base_image['image']
#     image_ext = base_image['ext']
#     pil_image = Image.open(BytesIO(image_bytes))
#     image_name = str(i) + '.' + image_ext

#     inputs = processor(images=[pil_image], return_tensors="pt")

#     if inputs['input_ids'].shape[1] > max_sequence_length:
#         inputs['input_ids'] = inputs['input_ids'][:, :max_sequence_length]
#         inputs['attention_mask'] = inputs['attention_mask'][:, :max_sequence_length]
#     outputs = model(**inputs)
#     predictions = torch.argmax(outputs.logits, dim=2)

#     layout_output_name = f'layout_output_{i}.txt'
#     with open(os.path.join('Layout Analysis Results/', layout_output_name), 'w') as layout_output_file:
#         layout_output_file.write(str(predictions[0].tolist()))

#     with open(os.path.join('backend/output images/', image_name), 'wb') as image_file:
#         pil_image.save(image_file)

# from paddleocr import PaddleOCR, draw_ocr

# ocr = PaddleOCR(use_angle_cls=True, lang='en')

# img_path = "backend\\output images\\1.jpeg"

# result = ocr.ocr(img_path, use_gpu=False)

# for line in result:
#     line_text = ' '.join([word_info[-1] for word_info in line])
#     print(line_text)

# from PIL import Image
# image = Image.open(img_path).convert('RGB')
# boxes = [line[0] for line in result]
# txts = [line[1][0] for line in result]
# scores = [line[1][1] for line in result]
# im_show = draw_ocr(image, boxes, txts, scores, font_path='/path/to/font')
# im_show = Image.fromarray(im_show)
# im_show.save('result.jpg')