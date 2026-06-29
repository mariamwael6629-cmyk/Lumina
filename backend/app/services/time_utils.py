from datetime import datetime, timezone


def humanize_time(dt: datetime) -> str:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    now = datetime.now(timezone.utc)
    delta = now - dt
    seconds = delta.total_seconds()

    if seconds < 30:
        return "Now"
    if seconds < 60:
        return f"{int(seconds)}s"
    minutes = seconds / 60
    if minutes < 60:
        return f"{int(minutes)}m"
    hours = minutes / 60
    if hours < 24:
        return f"{int(hours)}h"
    if dt.date() == (now.date()):
        return "Today"
    days = hours / 24
    if days < 2:
        return "Yesterday"
    if days < 7:
        return f"{int(days)}d"
    return dt.strftime("%b %d")
