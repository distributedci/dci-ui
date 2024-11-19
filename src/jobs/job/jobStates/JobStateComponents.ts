import styled, { css } from "styled-components";
import {
  t_temp_dev_tbd as global_warning_color_100 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_info_color_100 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_BackgroundColor_dark_200 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_BackgroundColor_dark_400 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_danger_color_100 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_palette_purple_200 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_palette_black_200 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_palette_black_300 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_palette_black_500 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_palette_black_600 /* CODEMODS: you should update this color token */,
  t_temp_dev_tbd as global_palette_black_800 /* CODEMODS: you should update this color token */,
} from "@patternfly/react-tokens";
import { IFileStatus } from "types";

export const JobStates = styled.div<{ isDark: boolean }>`
  padding-bottom: 24px;
  background-color: #1b1d21;
  background-color: ${({ isDark }) =>
    isDark ? "#1b1d21" : global_BackgroundColor_dark_200.value};
`;

export const RawLogRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.5rem;
`;

export const JobStateHR = styled.div`
  height: 1px;
  border-bottom: 1px solid ${global_BackgroundColor_dark_400.value};
`;

export const JobStateRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
  min-height: 25px;
  border-bottom: 1px solid ${global_BackgroundColor_dark_400.value};
`;

export const JobStateName = styled.div`
  color: ${global_palette_black_500.value};
  font-size: 14px;
  font-family: monospace;
  flex: 1;
`;

export const LabelBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5em;
`;

export const Timetamp = styled.span`
  color: ${global_palette_black_500.value};
  font-size: 12px;
  font-family: monospace;
`;

export const Label = styled.span`
  z-index: 10;
  padding: 2px 5px;
  line-height: 12px;
  font-size: 12px;
  background-color: ${global_palette_black_600.value};
  border-radius: 6px;
  color: ${global_palette_black_300.value};
`;

interface FileRowProps {
  status: IFileStatus;
  isDark: boolean;
}

export const FileRow = styled.div<FileRowProps>`
  display: flex;
  align-items: center;
  min-height: 25px;
  border-bottom: 1px solid ${global_BackgroundColor_dark_400.value};
  ${({ status }) =>
    status === "failed" || status === "unreachable"
      ? css`
          color: ${global_danger_color_100.value};
        `
      : status === "skipped" || status === "ignored"
        ? css`
            color: ${global_info_color_100.value};
          `
        : status === "withAWarning"
          ? css`
              color: ${global_palette_purple_200.value};
            `
          : css`
              color: ${global_warning_color_100.value};
            `};
  background-color: ${({ isDark }) =>
    isDark ? "#1b1d21" : global_BackgroundColor_dark_200.value};
  &:hover {
    background-color: ${global_BackgroundColor_dark_400.value};
  }
`;

export const IconContainer = styled.div`
  width: 2rem;
  min-height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: ${global_palette_black_500.value};
  &:hover {
    color: ${global_palette_black_200.value};
  }
`;

export const FileName = styled.div`
  font-size: 14px;
  font-family: monospace;
  flex: 1;
`;

export const FileContent = styled.div`
  background-color: ${global_palette_black_800.value};
  padding: 1em 0;
  font-family: monospace;
`;

export const Pre = styled.pre`
  font-family: monospace;
  font-size: 11px;
  white-space: pre-wrap;
  word-wrap: break-word;
  padding: 0;
  margin: 0;
  border: none;
`;

export const JobStatePre = styled(Pre)`
  color: ${global_palette_black_200.value};
  padding: 0 20px 0 35px;
  margin-bottom: 1px;
`;
