using System;
using System.Collections.Generic;

namespace mapbox_workshop_api;

public partial class Review
{
    public long ListingId { get; set; }

    public DateOnly Date { get; set; }
}
