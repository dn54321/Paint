export function clearSelection()
{
    if (window.getSelection) {
        window.getSelection()!.removeAllRanges();
    }
}