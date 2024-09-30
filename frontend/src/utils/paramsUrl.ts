export const getPathName = (pathname: string) => {
    const path = pathname.split('/');
    return path[1];
}