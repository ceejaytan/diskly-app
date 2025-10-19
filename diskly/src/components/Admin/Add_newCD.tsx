import { useState } from "react";
import { API_URL } from "../../API/config";

import Add_CD_Message_Success from "./Add_newCD_Success";


enum Console_Platform {
  Playstation = "Playstation",
  Xbox = "Xbox",
  Nintendo = "Nintendo"
}

type more_boilerplate_because_reactjs_moment = {
  cancelbtn: () => void;
  }

export default function Add_newCD({cancelbtn}:more_boilerplate_because_reactjs_moment){
  const [imageSrc, setImageSrc] = useState("/images/default_add_image.png");
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [ConsolePlatform, setConsolePlatform] = useState(Console_Platform.Playstation);
  const [GameTitle, setGameTitle] = useState("");
  const [Quantity, setQuantity] = useState(1);
  const [QuantityValid, setQuantityValid] = useState(true);
  const [Price, setPrice] = useState(100);
  const [PriceValid, setPriceValid] = useState(true);

  const [addCDFailed, setAddCDFailed] = useState("");
  const [addCDSuccess, setAddCDSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setImageFile(file)
      };
      reader.readAsDataURL(file);
    }
  };


  function digits_only_quantity(e: any){
    const val = e.target.value
    if (val === ""){
      setQuantity(val);
      setQuantityValid(false);
      return;
    }
    const numval = Number(val);
    if (/^\d*$/.test(val) && numval > -1 && val !== "0" && val < 2147483647) {
      setQuantity(val)
      setQuantityValid(true);
    }
  }

  function digits_only_price(e: any){
    const val = e.target.value
    if (val === ""){
      setPrice(val);
      setPriceValid(false);
      return;
    }
    const numval = Number(val);
    if (/^\d+(\.\d{0,2})?$/.test(val) && numval > -1 && val !== "0" && val < 2147483647) {
      setPrice(val)
      setPriceValid(true);
    }
  }

async function submit_saveCD(e: any){
    e.preventDefault();
    setLoading(true);

    setAddCDFailed("");
    if(!imageFile){
    setAddCDFailed("No Image Selected");
    setLoading(false);
      return;
    }

    const formdata = new FormData();
    formdata.append("game_name", GameTitle);
    formdata.append("platform", ConsolePlatform);
    formdata.append("price", Price.toString());
    formdata.append("quantity", Quantity.toString());
    formdata.append("image", imageFile);

  const res = await fetch(`${API_URL}/admin/add_game`,{
      method: "POST",
      credentials: "include",
      body: formdata
    });
  const data = await res.json();
  if (res.ok){
      setAddCDSuccess(true);
    }else{
      setAddCDFailed(data.detail)

    }
    setLoading(false);
}

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50 p-4" onClick={cancelbtn}>
      <div className="rent-form-container bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl w-full max-w-xl p-8 text-cyan-100" onClick={(e) => e.stopPropagation()}>

      {/* 🔄 Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-50">
          <div className="w-14 h-14 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-cyan-300 text-lg font-semibold">
            Uploading...
          </p>
        </div>
      )}

        <form className="rent-form flex flex-col gap-6" onSubmit={(e) => submit_saveCD(e)}>
          <h2 className="text-[40px] font-bold text-cyan-400 text-center mb-2">
            Add New CD
          </h2>
          <div className="flex justify-center">
            <img
              src="/images/disklogo.png"
              alt="Diskly Logo"
              className="w-20 h-20 object-contain"
            />
          </div>


          {/* Game Title */}
          <div className="flex flex-col items-center">
            <label className="text-sm font-semibold text-cyan-300 mb-1 w-[93%] text-left">
              Game Title
            </label>
            <input
              className="
              bg-[#D6DCDE]
              border
              border-cyan-400/60
              text-black
              rounded-[13px]
              h-[40px] w-[100%]
              flex
              items-center
              "
              value={GameTitle}
              onChange={(e) => setGameTitle(e.target.value) }
              required
            />
          </div>

          {/* Console / Quantity / Price */}
          <div className="grid grid-cols-[2fr_1fr_2fr] gap-4">
            {/* Console */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Console
              </label>
              <select
                className="
                  adminpage-stock-addnewcd-padding-fix
                  bg-[#D6DCDE]
                  border
                  border-cyan-400/60
                  text-black
                  rounded-[13px]
                  h-[40px] w-[100%]
                "
                value={ConsolePlatform}
                onChange={(e) => setConsolePlatform(e.target.value as Console_Platform)}
              >
                {Object.values(Console_Platform).map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Quantity
              </label>
              <div className="flex w-full max-w-[100%]">
                <input
                  type="text"
                  className={`
                  bg-[#D6DCDE]
                  border-2
                  text-black
                  rounded-[13px]
                  h-[40px] w-full
                  items-center

                ${!QuantityValid ? "border-red-500" : "border-green-500"}
                  `}
              value={Quantity}
              onChange={(e) => digits_only_quantity(e) }
                />
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col items-center">
              <label className="text-sm font-semibold text-cyan-300 mb-1 w-[85%] text-left">
                Price
              </label>
              <div className="flex w-full max-w-[100%]">
              <span className={`
                  bg-[#D6DCDE]
                  border-2
                  border-r-0
                  text-black
                  text-right
                  rounded-l-[13px]
                  border-cyan-400/60
                  flex
                  items-center
                  w-[10%]
                ${!PriceValid ? "border-red-500" : "border-green-500"}
                   `}
                  >&nbsp;₱</span>
              <input className={`
                adminpage-stocks-priceinput
                bg-[#D6DCDE]
                border-2
                border-l-0
                border-cyan-400/60
                text-black
                rounded-r-[13px]
                h-[40px] w-[100%]
                ${!PriceValid ? "border-red-500" : "border-green-500"}
                  `}
              value={Price}
              onChange={(e) => digits_only_price(e) }
                />

                </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="flex flex-col items-center gap-2">
            {imageSrc === "/images/default_add_image.png" && (
            <p className="text-cyan-300 text-sm">Add cover photo</p>
            )}
            <label htmlFor="cdImage" className="adminage-stock-addnewcd-addimage cursor-pointer bg-[#D6DCDE]">
              <img
                src={imageSrc}
                alt="CD Cover"
                className={`
                ${imageSrc === "/images/default_add_image.png" ? "w-28 h-28" : "w-full h-60"}
                `}
              />
            </label>
            <input
              id="cdImage"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />

          </div>

        {addCDFailed && (
          <p className="text-red-500 text-center">{addCDFailed}</p>
        )}

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="rent-form-submitrentalbtn hover:bg-cyan-300 disabled:opacity-50 disabled:bg-cyan-400/20"
            disabled={!QuantityValid || !PriceValid || !GameTitle || !imageFile || loading}
          >
            {loading ? "Saving..." : "Save New CD"}
          </button>
          <button
            type="button"
            className="rent-form-cancelbtn hover:bg-cyan-400/10"
            onClick={cancelbtn}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
      </div>
      {addCDSuccess && (
      <Add_CD_Message_Success cancelbtn={() => {setAddCDSuccess(false); cancelbtn(); }}/>
      )}

    </div>
  );
}
