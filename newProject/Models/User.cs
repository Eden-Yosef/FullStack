using System;
using System.Collections.Generic;

namespace newProject.Models;

public partial class User
{
    public int Id { get; set; }

    public bool? IsStudent { get; set; }

    public string? Password { get; set; }

    public string? Name { get; set; }

}
