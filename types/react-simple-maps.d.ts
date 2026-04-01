declare module 'react-simple-maps' {
  import { ComponentType, CSSProperties, ReactNode } from 'react';

  interface ProjectionConfig {
    scale?: number;
    center?: [number, number];
    rotate?: [number, number, number];
  }

  interface ComposableMapProps {
    projectionConfig?: ProjectionConfig;
    width?: number;
    height?: number;
    style?: CSSProperties;
    children?: ReactNode;
  }

  interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: string | object;
    children: (data: { geographies: GeographyType[] }) => ReactNode;
  }

  interface GeographyType {
    rsmKey: string;
    id?: string;
    properties: Record<string, unknown>;
    geometry: object;
  }

  interface GeoStyleObject {
    outline?: string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    cursor?: string;
  }

  interface GeographyProps {
    key?: string;
    geography: GeographyType;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    style?: {
      default?: GeoStyleObject;
      hover?: GeoStyleObject;
      pressed?: GeoStyleObject;
    };
    onMouseEnter?: (evt: React.MouseEvent) => void;
    onMouseMove?: (evt: React.MouseEvent) => void;
    onMouseLeave?: (evt: React.MouseEvent) => void;
    onClick?: (evt: React.MouseEvent) => void;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const ZoomableGroup: ComponentType<ZoomableGroupProps>;
  export const Geographies: ComponentType<GeographiesProps>;
  export const Geography: ComponentType<GeographyProps>;
}
