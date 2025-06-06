import { useEffect, useRef } from 'react';
import { useAtomValue } from 'jotai';

import { resolutionAtom } from '@/jotai/device.ts';
import { scrollDirectionAtom } from '@/jotai/mouse.ts';
import { device } from '@/libs/device';
import { Key } from '@/libs/device/mouse.ts';

export const Absolute = () => {
  const resolution = useAtomValue(resolutionAtom);
  const scrollDirection = useAtomValue(scrollDirectionAtom);

  const keyRef = useRef<Key>(new Key());

  // listen mouse events
  useEffect(() => {
    const canvas = document.getElementById('video');
    if (!canvas) return;

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel);
    canvas.addEventListener('click', disableEvent);
    canvas.addEventListener('contextmenu', disableEvent);

    // press button
    async function handleMouseDown(event: any) {
      disableEvent(event);

      switch (event.button) {
        case 0:
          keyRef.current.left = true;
          break;
        case 1:
          keyRef.current.mid = true;
          break;
        case 2:
          keyRef.current.right = true;
          break;
        default:
          console.log(`unknown button ${event.button}`);
          return;
      }

      await send(event);
    }

    // release button
    async function handleMouseUp(event: any) {
      disableEvent(event);

      switch (event.button) {
        case 0:
          keyRef.current.left = false;
          break;
        case 1:
          keyRef.current.mid = false;
          break;
        case 2:
          keyRef.current.right = false;
          break;
        default:
          console.log(`unknown button ${event.button}`);
          return;
      }

      await send(event);
    }

    // mouse move
    async function handleMouseMove(event: any) {
      disableEvent(event);
      await send(event);
    }

    // mouse scroll
    async function handleWheel(event: any) {
      disableEvent(event);

      const delta = Math.floor(event.deltaY);
      if (delta === 0) return;

      await send(event, delta > 0 ? -1 * scrollDirection : scrollDirection);
    }

    async function send(event: MouseEvent, scroll: number = 0) {
      const rect = canvas!.getBoundingClientRect();
      const x = Math.abs(event.clientX - rect.left);
      const y = Math.abs(event.clientY - rect.top);

      await device.sendMouseAbsoluteData(keyRef.current, rect.width, rect.height, x, y, scroll);
    }

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('wheel', handleWheel);
      canvas.removeEventListener('click', disableEvent);
      canvas.removeEventListener('contextmenu', disableEvent);
    };
  }, [resolution, scrollDirection]);

  // disable default events
  function disableEvent(event: any) {
    event.preventDefault();
    event.stopPropagation();
  }

  return <></>;
};
