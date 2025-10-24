from datetime import datetime
from pydantic import BaseModel
from fastapi import UploadFile
from PIL import Image
import os
import io


class AdminValidations:


    class add_games_model(BaseModel):
        game_name: str
        description: str
        platform: str
        price: float
        quantity: int

    MAX_FILE_SIZE = 2 * (1024 * 1024)

    @staticmethod
    def validate_image(contents: bytes) -> str:
        """
        Returns file extension ("png" or "jpeg") if valid.
        Raises ValueError otherwise.
        Also checks image size.
        """
        if len(contents) > AdminValidations.MAX_FILE_SIZE:
            raise ValueError("File size exceed")

        try:
            img = Image.open(io.BytesIO(contents))
            img.verify()
            fmt = (img.format or "").lower()
            if fmt not in ["png", "jpeg"]:
                raise ValueError("Unsupported file type")
            return fmt
        except Exception:
            raise ValueError("Invalid or corrupted image file")



    @staticmethod
    async def image_valid(
        image: UploadFile, 
        image_file_name: str, 
        old_image_path: str | None = None
    ) -> str:
        """
        I have no idea
        """
        if image.filename is None:
            return ""

        image_contents = await image.read()
        print("file size = %.2f MB" % (len(image_contents) / (1024 * 1024)))

        try:
            file_extension = AdminValidations.validate_image(image_contents)
        except ValueError as err:
            print(err)
            return ""

        # safe_name = "".join(c for c in image_file_name if c.isalnum() or c in (" ", "-", "_")).strip()
        # safe_name = safe_name.replace(" ", "_")
        file_name = f"{image_file_name}.{file_extension}"
        image_dir = "images/gamecover"
        os.makedirs(image_dir, exist_ok=True)
        image_path = os.path.join(image_dir, file_name)

        counter = 1
        while os.path.isfile(image_path):
            image_path = os.path.join(image_dir, f"{image_file_name}_copy{counter}.{file_extension}")
            counter += 1

        try:
            with open(image_path, "wb") as f:
                f.write(image_contents)
            print(f"Image saved as {image_path}")

            if old_image_path and os.path.exists(old_image_path):
                if "DEFAULT_PIC.png" not in old_image_path:
                    os.remove(old_image_path)
                    print(f"Old image {old_image_path} removed.")

            return image_path

        except Exception as err:
            print(f"Failed to save image: {err}")
            return ""


    # @staticmethod
    # async def image_valid(image: UploadFile, image_file_name: str) -> str:
    #     if image.filename is None:
    #         return ""
    #
    #     image_contents = await image.read()
    #     print("file size = %.2f MB"%((len(image_contents) / (1024 * 1024))))
    #     try: 
    #         file_extension = AdminValidations.validate_image(image_contents)
    #     except ValueError as err:
    #         print(err)
    #         return ""
    #     print(file_extension)
    #     file_name = f"{image_file_name}.{file_extension}"
    #     file_name_without_extension = os.path.splitext(image.filename)[0]
    #     counter = 1
    #
    #     while os.path.isfile(f"images/gamecover/{file_name}"):
    #         print("file already exists.")
    #         file_name = f"{file_name_without_extension}_copy{counter}.{file_extension}"
    #         counter += 1
    #         print(f"new file name: {file_name}")
    #
    #     image_path = f"images/gamecover/{file_name}"
    #
    #     try:
    #         with open(image_path, "wb") as f:
    #             f.write(image_contents)
    #         print("uploadfile success")
    #         return image_path
    #     except Exception as err:
    #         print(err)
    #         return ""



    # @staticmethod
    # def Add_games_valid(request: add_games_model) -> bool:
    #     print(request)
    #
    #     game_name_regex = r"^[\w\s\-'!]{2,100}$"
    #     platform_regex = r"^[\w\s]{2,50}$"
    #     genre_regex = r"^[\w\s]{2,50}$"
    #
    #     if not re.match(game_name_regex, request.game_name) or \
    #         not re.match(platform_regex, request.platform):
    #         return False
    #
    #     return True

class UserRentals:

    class RentalFormModel(BaseModel):
        userid: int
        username: str
        game_id: int
        game_title: str
        rental_start_date: datetime
        return_date: datetime
        console: str
        quantity: int
        total_cost: float
