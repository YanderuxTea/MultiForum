import { RefObject, useEffect, useMemo, useState } from "react";
import { MotionValue } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

interface IChunk<A> {
  id: string;
  height: number;
  arrayElements: A[];
  elementsHeights: number[];
}
export interface IVisibleChunk<A> extends IChunk<A> {
  topPosition: number;
}
export default function useVirtualizeChunks<A extends { createdAt: Date }>({
  invisibleContainerRef,
  buffer,
  maxLengthInChunk,
  topVisible,
  bottomVisible,
  y,
  yOffset,
}: {
  y: MotionValue;
  yOffset: RefObject<number>;
  topVisible: number;
  bottomVisible: number;
  buffer: number;
  maxLengthInChunk: number;
  invisibleContainerRef: RefObject<HTMLDivElement | null>;
}) {
  const [chunks, setChunks] = useState<IChunk<A>[]>([]);
  const [chunksForInvisibleContainer, setChunksForInvisibleContainer] =
    useState<IChunk<A>[]>([]);
  const [negativeOffsets, setNegativeOffsets] = useState<number[]>([]);
  const [positiveOffsets, setPositiveOffsets] = useState<number[]>([]);
  const [negativeOffset, setNegativeOffset] = useState<number>(0);
  const [positiveOffset, setPositiveOffset] = useState<number>(0);
  const [startIndexPositive, setStartIndexPositive] = useState<number>(0);
  const [stableHeightContainer, setStableHeightContainer] =
    useState<number>(10);
  const [visibleChunks, setVisibleChunks] = useState<IVisibleChunk<A>[]>([]);
  const topVisibleAreaWithBuffer = Math.max(0, topVisible - buffer);
  const bottomVisibleAreaWithBuffer = bottomVisible + buffer;
  // Изменение оффсетов
  function changeOffsets(
    isNewChunk: boolean,
    height: number,
    isHistory: boolean,
  ) {
    if (isNewChunk) {
      if (isHistory) {
        setNegativeOffset((prevState) => prevState + height);

        setNegativeOffsets((prevState) => [
          prevState[0] ? prevState[0] + height : height,
          ...prevState,
        ]);
      } else {
        setPositiveOffset((prevState) => prevState + height);
        setPositiveOffsets((prevState) => [
          ...prevState,
          prevState[prevState.length - 1]
            ? prevState[prevState.length - 1] + height
            : height,
        ]);
      }
    } else {
      setPositiveOffset((prevState) => prevState + height);
      setPositiveOffsets((prevState) => {
        const newChunk = [...prevState];
        newChunk[newChunk.length - 1] = newChunk[newChunk.length - 1] + height;
        return newChunk;
      });
    }
  }

  // Создание нового чанка
  function createNewChunk(
    elements: A[],
    isHistory: boolean,
    height: number,
    elementsHeights: number[],
  ) {
    changeOffsets(true, height, isHistory);
    if (isHistory) {
      setChunks((prevState) => [
        {
          id: uuidv4(),
          height: height,
          arrayElements: elements,
          elementsHeights: elementsHeights,
        },
        ...prevState,
      ]);
      setStartIndexPositive((prevState) => prevState + 1);
      y.stop();
      y.set(yOffset.current - height);
    } else {
      setChunks((prevState) => [
        ...prevState,
        {
          id: uuidv4(),
          height: height,
          arrayElements: elements,
          elementsHeights: elementsHeights,
        },
      ]);
    }
  }

  // Добавление элемента в чанк
  function addElementsInChunk(
    elements: A[],
    height: number,
    isCrowded: boolean,
    elementsHeights: number[],
    elementsNextChunk?: A[],
  ) {
    changeOffsets(false, height, false);
    setChunks((prevState) => {
      const newChunk = [...prevState];
      newChunk[newChunk.length - 1] = {
        id: newChunk[newChunk.length - 1].id,
        height: newChunk[newChunk.length - 1].height + height,
        arrayElements: [
          ...newChunk[newChunk.length - 1].arrayElements,
          ...elements,
        ],
        elementsHeights: [
          ...newChunk[newChunk.length - 1].elementsHeights,
          ...elementsHeights,
        ],
      };
      return newChunk;
    });
    if (isCrowded && elementsNextChunk) {
      requestAnimationFrame(() => {
        if (!invisibleContainerRef.current) return;
        const height = invisibleContainerRef.current.clientHeight;
        const elements =
          invisibleContainerRef.current.firstElementChild?.children;
        const heightsMessages: number[] = [];
        if (elements) {
          for (let i = 0; i < elements.length; i++) {
            heightsMessages.push(elements[i].clientHeight);
          }
        }
        setStableHeightContainer((prevState) => prevState + height);
        createNewChunk(elementsNextChunk, false, height, elementsHeights);
      });
    }
  }
  const [pendingAction, setPendingAction] = useState<{
    elements: A[];
    isHistory: boolean;
    isNewChunk: boolean;
    isCrowdedChunk: boolean;
    elementsPrevChunk?: A[];
    elementsNextChunk?: A[];
  } | null>(null);
  useEffect(() => {
    if (!pendingAction) return;
    requestAnimationFrame(() => {
      if (!invisibleContainerRef.current) return;

      const height = invisibleContainerRef.current.clientHeight;
      const elements =
        invisibleContainerRef.current.firstElementChild?.children;
      const heightsMessages: number[] = [];
      if (elements) {
        for (let i = 0; i < elements.length; i++) {
          heightsMessages.push(elements[i].clientHeight);
        }
      }
      setStableHeightContainer((prevState) => prevState + height);
      if (
        pendingAction.isCrowdedChunk &&
        pendingAction.elementsNextChunk &&
        pendingAction.elementsPrevChunk
      ) {
        setPendingAction(null);
        addElementsInChunk(
          pendingAction.elementsPrevChunk,
          height,
          true,
          heightsMessages,

          pendingAction.elementsNextChunk,
        );
        setChunksForInvisibleContainer([
          {
            height: 0,
            arrayElements: pendingAction.elementsNextChunk,
            id: uuidv4(),
            elementsHeights: heightsMessages,
          },
        ]);
        return;
      }
      if (pendingAction.isNewChunk) {
        createNewChunk(
          pendingAction.elements,
          pendingAction.isHistory,
          height,
          heightsMessages,
        );
      } else {
        addElementsInChunk(
          pendingAction.elements,
          height,
          false,
          heightsMessages,
        );
      }
    });
  }, [chunksForInvisibleContainer, pendingAction]);
  // обновление высоты основного контейнера
  function updateHeightContainer(
    elements: A[],
    isHistory: boolean,
    isNewChunk: boolean,
    isCrowdedChunk: boolean,
    elementsPrevChunk?: A[],
    elementsNextChunk?: A[],
  ) {
    if (isCrowdedChunk && elementsPrevChunk && elementsNextChunk) {
      setChunksForInvisibleContainer([
        {
          height: 0,
          arrayElements: elementsPrevChunk,
          id: uuidv4(),
          elementsHeights: [],
        },
      ]);
    } else if (!isCrowdedChunk) {
      setChunksForInvisibleContainer([
        {
          height: 0,
          arrayElements: elements,
          id: uuidv4(),
          elementsHeights: [],
        },
      ]);
    }
    setPendingAction({
      elements: elements,
      elementsPrevChunk: elementsPrevChunk,
      elementsNextChunk: elementsNextChunk,
      isCrowdedChunk: isCrowdedChunk,
      isNewChunk: isNewChunk,
      isHistory: isHistory,
    });
  }
  // Добавление новых сообщений
  function addNewMessage(elements: A[]) {
    const countElements = elements.length;
    const lastChunk = chunks[chunks.length - 1];
    const maxCountElementsAddedInChunk = lastChunk
      ? maxLengthInChunk - lastChunk.arrayElements.length
      : 0;
    if (maxCountElementsAddedInChunk <= 0) {
      updateHeightContainer(elements, false, true, false);
    } else if (countElements > maxCountElementsAddedInChunk) {
      const elementsInPrevChunk = elements.slice(
        0,
        maxCountElementsAddedInChunk,
      );
      const elementsInNextChunk = elements.slice(maxCountElementsAddedInChunk);
      updateHeightContainer(
        elementsInNextChunk,
        false,
        false,
        true,
        elementsInPrevChunk,
        elementsInNextChunk,
      );
    } else {
      updateHeightContainer(elements, false, false, false);
    }
  }

  const [block, setBlock] = useState<boolean>(false);
  function updateVisibleChunks() {
    if (block) {
      return;
    }
    const findIndex = binarySearchIndex();
    const startIndex = Math.max(0, findIndex - 2);
    const endIndex = Math.min(chunks.length - 1, findIndex + 2);
    const arrayCheck = chunks.slice(startIndex, endIndex + 1);
    const offsets = [...negativeOffsets, ...positiveOffsets];
    setBlock(true);
    const visibleChunksLocal: IVisibleChunk<A>[] = [];
    for (let i = 0; i < arrayCheck.length; i++) {
      const isNegativeChunk = startIndex + i < startIndexPositive;
      const topEl = isNegativeChunk
        ? negativeOffset - offsets[startIndex + i]
        : offsets[startIndex + i] - arrayCheck[i].height + negativeOffset;
      const bottomEl = topEl + arrayCheck[i].height;
      if (
        topVisibleAreaWithBuffer <= bottomEl &&
        bottomVisibleAreaWithBuffer >= topEl
      ) {
        visibleChunksLocal.push({
          id: arrayCheck[i].id,
          height: arrayCheck[i].height,
          arrayElements: arrayCheck[i].arrayElements,
          topPosition: topEl,
          elementsHeights: arrayCheck[i].elementsHeights,
        });
      }
    }
    setVisibleChunks(visibleChunksLocal);
    requestAnimationFrame(() => {
      setBlock(false);
    });
  }
  // Добавление истории сообщений
  function addHistoryMessage(elements: A[]) {
    if (chunks.length === 0) {
      addNewMessage(elements);
      return;
    }
    updateHeightContainer(elements, true, true, false);
  }

  function binarySearchIndex() {
    const offsets = [...negativeOffsets, ...positiveOffsets];
    let left = 0;
    let right = offsets.length - 1;
    while (left <= right) {
      const middle = Math.floor((left + right) / 2);
      const isNegativeChunk = middle < startIndexPositive;
      const topEl = isNegativeChunk
        ? negativeOffset - offsets[middle]
        : offsets[middle] - chunks[middle].height + negativeOffset;
      const bottomEl = topEl + chunks[middle].height;
      if (
        topVisibleAreaWithBuffer <= bottomEl &&
        bottomVisibleAreaWithBuffer >= topEl
      ) {
        return middle;
      }
      if (topVisibleAreaWithBuffer >= bottomEl) {
        left = middle + 1;
      } else if (bottomVisibleAreaWithBuffer <= topEl) {
        right = middle - 1;
      }
    }
    return -1;
  }
  const [dateVisible, setDateVisible] = useState<Date>(new Date());
  const visibleChunksLocal = useMemo(
    () =>
      visibleChunks.filter((chunk) => {
        const top = chunk.topPosition;
        const bottom = top + chunk.height;

        return topVisible <= bottom && bottomVisible >= top;
      }),
    [bottomVisible, topVisible, visibleChunks],
  );
  const bottomPointsMessagesVisible = useMemo(() => {
    const heights = visibleChunksLocal.flatMap(
      (chunks) => chunks.elementsHeights,
    );
    if (visibleChunksLocal.length > 0) {
      let acc = visibleChunksLocal[0].topPosition;
      return heights.map((height) => {
        acc += height;
        return acc;
      });
    }
  }, [visibleChunksLocal]);

  useEffect(() => {
    if (block) return;
    if (bottomPointsMessagesVisible) {
      const visibleBottomPointsFilter = bottomPointsMessagesVisible
        .map((val, index) => {
          if (val >= topVisible) {
            return {
              point: val,
              index: index,
            };
          } else {
            return null;
          }
        })
        .filter(Boolean);
      const visibleBottomPoint = visibleBottomPointsFilter[0];
      if (visibleBottomPoint) {
        const dateVisibleConst =
          visibleChunksLocal[0].arrayElements[visibleBottomPoint.index]
            .createdAt;
        if (dateVisibleConst !== dateVisible) {
          setDateVisible(dateVisibleConst);
        }
      }
    }
  }, [
    bottomPointsMessagesVisible,
    block,
    topVisible,
    visibleChunksLocal,
    dateVisible,
  ]);
  useEffect(() => {
    if (block) return;
    updateVisibleChunks();
  }, [chunks, topVisibleAreaWithBuffer, bottomVisibleAreaWithBuffer, block]);
  return {
    chunks,
    addHistoryMessage,
    addNewMessage,
    visibleChunks,
    dateVisible,
    chunksForInvisibleContainer,
    stableHeightContainer,
  };
}
