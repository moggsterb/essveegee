import BaseSvg from "./components/BaseSvg";
import BouncingDots from "./components/BouncingDots";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-xl mb-4">Bouncing Dots Animation</h1>

      <div
        className="flex items-center justify-center"
        style={{ height: "60vh" }}
      >
        <div className="h-full aspect-square">
          <BaseSvg width={1000} height={1000} bgColor="#111111">
            <BouncingDots
              rows={5}
              columns={5}
              svgWidth={1000}
              svgHeight={1000}
            />
          </BaseSvg>
        </div>
      </div>
    </div>
  );
}
