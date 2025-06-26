import Button from "@/components/FormMenuButton";

export default function Home() {
  return (
    <div className="justify-center items-center flex flex-col h-screen">
      <div className="justify-center items-center flex flex-col py-16 px-24 bg-gray-500 rounded-sm gap-y-16">
        <div className="flex items-center flex-col gap-y-1 justify-center ">
          <div className="bg-[#7CFC00] box cursor-default">Monitoring</div>
          <select
            name="bahasa"
            id="bahasa"
            className="p-2 rounded-sm bg-gray-200 cursor-pointer"
          >
            <option className="text-center" value="id">
              Bahasa Indonesia
            </option>
            <option className="text-center" value="en">
              English
            </option>
          </select>
        </div>

        <div className="flex justify-center items-center flex-col gap-y-4">
          <Button url="/spb" className="bg-[#CD853F]">
            SPB
          </Button>
          <Button url="/slp" className="bg-[#87CEFA]">
            SLP
          </Button>
          <Button url="/optimalisasi" className="bg-pink-300">
            Optimalisasi
          </Button>
          {/* <Button url="/" className="bg-lime-300">
            Exit
          </Button> */}
        </div>

        <div className="bg-[#F5DEB3] box cursor-default">Version 1.x</div>
      </div>
    </div>
  );
}
