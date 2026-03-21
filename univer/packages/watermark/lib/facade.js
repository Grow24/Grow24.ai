import { FUniver as n, FEnum as o } from "@univerjs/core/facade";
import { IWatermarkTypeEnum as e } from "@univerjs/engine-render";
import { WatermarkService as m, WatermarkTextBaseConfig as k, WatermarkImageBaseConfig as s } from "@univerjs/watermark";
class g extends n {
  addWatermark(r, t) {
    const a = this._injector.get(m);
    if (r === e.Text)
      a.updateWatermarkConfig({
        type: e.Text,
        config: {
          text: {
            ...k,
            ...t
          }
        }
      });
    else if (r === e.Image)
      a.updateWatermarkConfig({
        type: e.Image,
        config: {
          image: {
            ...s,
            ...t
          }
        }
      });
    else
      throw new Error("Unknown watermark type");
    return this;
  }
  deleteWatermark() {
    return this._injector.get(m).deleteWatermarkConfig(), this;
  }
}
class W {
  get IWatermarkTypeEnum() {
    return e;
  }
}
n.extend(g);
o.extend(W);
