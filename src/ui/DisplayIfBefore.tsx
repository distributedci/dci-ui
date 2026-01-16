interface DisplayIfBeforeProps extends React.PropsWithChildren {
  date: string;
}

function DisplayIfBefore({ date, children }: DisplayIfBeforeProps) {
  const expirationDate = new Date(date);

  const now = new Date();

  if (now > expirationDate) {
    return null;
  }

  return <>{children}</>;
}

export default DisplayIfBefore;
