// #region Global Imports
import "styled-components";
// #endregion Global Imports
type CommonColors = "transparent" | "darkGrey" | "blackGrey" | "lightGrey" | "whiteGrey" | "white" | 'black' | 'red' | 'green';

type CommonSizes = 'mobileWidth'

type ExtendedSizes = CommonSizes

type ExtendedColors =
  | CommonColors
  | "toggleBorder"
  | "gradient"
  | "background"
  | "headerBg"
  | "cardsBg"
  | "textColor"
  | "dodgerBlue";
declare module "styled-components" {
  export interface BaseTheme {
    colors: Record<CommonColors, string>;
    size: Record<CommonSizes, number>;
  }

  export interface DefaultTheme extends BaseTheme {
    colors: Record<ExtendedColors, string>;
    size: Record<ExtendedSizes, number>;
  }
}
